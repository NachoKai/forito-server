import { escapeRegExp } from "./escapeRegExp";

describe("escapeRegExp", () => {
  it("should escape regExp special characters", () => {
    expect(escapeRegExp("test")).toBe("test");
    expect(escapeRegExp("test*")).toBe("test\\*");
    expect(escapeRegExp("test+")).toBe("test\\+");
    expect(escapeRegExp("test?")).toBe("test\\?");
    expect(escapeRegExp("test^")).toBe("test\\^");
    expect(escapeRegExp("test$")).toBe("test\\$");
    expect(escapeRegExp("test.")).toBe("test\\.");
    expect(escapeRegExp("test|")).toBe("test\\|");
    expect(escapeRegExp("test(")).toBe("test\\(");
    expect(escapeRegExp("test)")).toBe("test\\)");
    expect(escapeRegExp("test[")).toBe("test\\[");
    expect(escapeRegExp("test]")).toBe("test\\]");
    expect(escapeRegExp("test{")).toBe("test\\{");
    expect(escapeRegExp("test}")).toBe("test\\}");
  });
});
