import sequelize from 'sequelize';
export function replaceModels(payload: any, models: any) {
  const payloadKeys = Object.keys(payload);
  if (payloadKeys.includes('model') && !payloadKeys.includes('attributes'))
    throw {message: `attributes property for ${payload.model} is required`};
  const obj = payloadKeys
    .map((key) => {
      if (key === 'where') payload[key] = inspect(payload.where);
      if (key === 'model') {
        if (!Object.keys(models).includes(payload[key])) return `model ${payload[key]} does not exists`;
        payload[key] = models[payload[key]];
      }
      if (key === 'include') {
        payload[key] = payload[key].map((item: any) => replaceModels(item, models));
      }
    })
    .filter((item) => item);
  if (obj.length > 0) throw {message: obj[0]};
  return payload;
}
function inspect(payload: any) {
  typeof payload === 'object' &&
    Object.keys(payload).map((key) => {
      if (key.indexOf('Op') !== -1) {
        const rKey = replaceOp(key);

        if (Array.isArray(payload[key])) payload[rKey] = payload[key].map((item: any) => inspect(item));
        else payload[rKey] = payload[key];
        delete payload[key];
      } else {
        payload[key] = inspect(payload[key]);
      }
    });
  return payload;
}
function replaceOp(key: string) {
  const op = key.split('.');
  return sequelize[op[0]][op[1]];
}
