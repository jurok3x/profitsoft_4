import axios from 'axios';
import log4js from 'log4js';
import { getConsulValue } from 'src/helper/consul';
import type { IArticleClient } from './interfaces/IArticleClient';

type EnvType = 'dev' | 'prod';

class ArticleClient implements IArticleClient {
    

    public async checkArticleExists(articleId: string): Promise<boolean> {
        try {
            let env: EnvType = 'prod';
            if (String(process.env.NODE_ENV).trim() === 'dev') {
                env = 'dev';
            }
            const articleApiUrl = await getConsulValue(`${env}/ARTICLE_API_URL`);
            
            if (!articleApiUrl) {
                throw new Error('ARTICLE_API_URL is not initialized');
            }

            const response = await axios.get(`${articleApiUrl}/${articleId}`);
            return response.status === 200;
        } catch (error) {
            log4js.getLogger().error(`Error checking article existence for ID ${articleId}:`, error);
            return false;
        }
    }
}

export { ArticleClient };
