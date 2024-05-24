import Consul, { ConsulOptions } from 'consul';
import config from '../config';

type EnvType = 'dev' | 'prod';

let env: EnvType = 'prod';
if (String(process.env.NODE_ENV).trim() === 'dev') {
    env = 'dev';
}

const consulServer = new Consul(config.consul.server[env] as ConsulOptions);

const prefix = `config/${config.consul.service.name}`;

type ConsulResult = {
	Value: string | number,
};

export const getConsulValue = async (key: string) => {
    const result: ConsulResult = await consulServer.kv.get(`${prefix}/${key}`);
    return result?.Value;
};