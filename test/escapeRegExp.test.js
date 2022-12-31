// export const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

import { escapeRegExp } from "../utils/escapeRegExp";

describe("escapeRegExp", () => {
	let string;

	beforeEach(() => {
		string = null;
	});

	it("should escape regExp", () => {
		string = "test";
		expect(escapeRegExp(string)).toBe("test");

		string = "test*";
		expect(escapeRegExp(string)).toBe("test\\*");

		string = "test+";
		expect(escapeRegExp(string)).toBe("test\\+");

		string = "test?";
		expect(escapeRegExp(string)).toBe("test\\?");

		string = "test^";
		expect(escapeRegExp(string)).toBe("test\\^");
	});
});
