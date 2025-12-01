interface ObjectAny {
	[key: string]: any
};

interface Key {
	username: string;
	appKey: string;
	service: string;
};

interface Feed {
	handle: string;
	webhook: string;
	colour: number;
}

interface Secrets {
	keys: Key[];
	feeds: Feed[];
}