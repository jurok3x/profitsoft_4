import axios from 'axios';
import Consul, { type ConsulOptions } from 'consul';
import log4js from 'log4js';
import config from '../config';
import type { IArticleClient } from './interfaces/IArticleClient';

const consul = new Consul(config.consul.server['dev'] as ConsulOptions);// fix

type ConsulResult = {
	Value: string,
};

class ArticleClient implements IArticleClient {
    private articleApiUrl: string;

    constructor() {
        this.init();
    }

    private async init() {
        try {
            const result: ConsulResult = await consul.kv.get('config/ARTICLE_API_URL');
            if (result && result?.Value) {
                this.articleApiUrl = result?.Value;
            } else {
                log4js.getLogger().info('Api url not found.')
                this.articleApiUrl = 'http://localhost:8080/api/v1/articles';
            }
        } catch (error) {
            log4js.getLogger().error('Error fetching ARTICLE_API_URL from Consul:', error);
            throw error;
        }
    }

    public async checkArticleExists(articleId: string): Promise<boolean> {
        try {
            if (!this.articleApiUrl) {
                throw new Error('ARTICLE_API_URL is not initialized');
            }

            const response = await axios.get(`${this.articleApiUrl}/${articleId}`);
            return response.status === 200;
        } catch (error) {
            log4js.getLogger().error(`Error checking article existence for ID ${articleId}:`, error);
            return false;
        }
    }
}

export { ArticleClient };
