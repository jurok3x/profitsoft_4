import log4js from 'log4js';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { saveGroup as saveGroupApi } from 'src/services/group'

const saveGroup = async (req: Request, res: Response) => {
	try {
		const {
			name,
			startYear,
		} = req.body;
		const id = await saveGroupApi({
			name,
			startYear,
		});
		res.status(httpStatus.CREATED).send({
			id,
		});
	} catch (err) {
		log4js.getLogger().error('Error in creating group.', err);
		res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).send({
			message: err.statusText || err.message,
		});
	}
}

export default saveGroup;