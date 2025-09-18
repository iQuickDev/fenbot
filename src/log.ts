import type { LogLevelDesc, RootLogger } from 'loglevel';
import { DateTime } from 'luxon';

export function configureLogger(log: RootLogger) {
	log.setLevel((process.env.LOG_LEVEL as LogLevelDesc) || log.levels.DEBUG);

	const originalFactory = log.methodFactory;
	log.methodFactory = (methodName, logLevel, loggerName) => {
		const rawMethod = originalFactory(methodName, logLevel, loggerName);

		return (message) => {
			let logMessage: unknown = null;
			if (typeof message === 'object' && message != null) {
				logMessage = JSON.stringify(message, null, 2);
				rawMethod(logMessage);
			} else {
				logMessage = `${DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm:ss")} | ${methodName.toUpperCase()} | ${message}`;
				rawMethod(logMessage);
			}
		};
	};
	log.rebuild();
}
