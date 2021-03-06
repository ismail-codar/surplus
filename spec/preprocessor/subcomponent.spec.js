describe("subcomponent", function () {
    it("is called with a property object", function () {
        var code = window.SurplusPreprocessor.preprocess('              \n\
            var props = null,                                           \n\
                SubComponent = p => props = p,                          \n\
                sub = <SubComponent foo="2" bar={3}/>;                  \n\
                                                                        \n\
            expect(props).toEqual({ foo: "2", bar: 3, children: [] });  \n\
        ');
        eval(code);
    });

    it("can have children", function () {
        var code = window.SurplusPreprocessor.preprocess('                  \n\
            var props = null,                                               \n\
                SubComponent = p => props = p,                              \n\
                sub =                                                       \n\
                    <SubComponent foo="2">                                  \n\
                        <span>text</span>                                   \n\
                        some words                                          \n\
                        <!-- comment -->                                    \n\
                    </SubComponent>;                                        \n\
                                                                            \n\
            expect(props).not.toBe(null);                                   \n\
            expect(props.foo).toBe("2");                                    \n\
            expect(props.children.length).toBe(3);                          \n\
            expect(props.children[0] instanceof HTMLSpanElement).toBe(true);\n\
            expect(props.children[0].innerText).toBe("text");               \n\
            expect(props.children[1]).toBe("some words");                   \n\
            expect(props.children[2] instanceof Comment).toBe(true);        \n\
            expect(props.children[2].data).toBe(" comment ");               \n\
        ');
        eval(code);
    });

    it("can have a single text child", function () {
        var code = window.SurplusPreprocessor.preprocess('                  \n\
            var props = null,                                               \n\
                SubComponent = p => (props = p, "sub"),                     \n\
                sub = <SubComponent>some words</SubComponent>;              \n\
                                                                            \n\
            expect(sub).toBe("sub");                                        \n\
            expect(props).not.toBe(null);                                   \n\
            expect(props.children.length).toBe(1);                          \n\
            expect(typeof props.children[0]).toBe("string");                \n\
            expect(props.children[0]).toBe("some words");                   \n\
        ');
        eval(code);
    });

    it("can be children", function () {
        var code = window.SurplusPreprocessor.preprocess('                  \n\
            var SubComponent = p => <span>{p.text}</span>,                  \n\
                div =                                                       \n\
                    <div>                                                   \n\
                        <SubComponent text="foo" />                         \n\
                    </div>;                                                 \n\
                                                                            \n\
            expect(div instanceof HTMLDivElement).toBe(true);               \n\
            expect(div.childNodes.length).toBe(1);                          \n\
            expect(div.childNodes[0] instanceof HTMLSpanElement).toBe(true);\n\
            expect(div.childNodes[0].innerText).toBe("foo");                \n\
        ');
        eval(code);
    });

    it("can have spread and fn properties", function () {
        var code = window.SurplusPreprocessor.preprocess('                        \n\
            var props = null,                                                     \n\
                SubComponent = p => props = p,                                    \n\
                mixin = p => p.d = 6,                                             \n\
                sub = <SubComponent                                               \n\
                        a="1"                                                     \n\
                        {...{ a: "2", b: true, c: "4"}}                           \n\
                        c={5}                                                     \n\
                        fn={mixin} />;                                            \n\
                                                                                  \n\
            expect(props).toEqual({ a: "2", b: true, c: 5, children: [], d: 6 }); \n\
        ');
        eval(code);
    });

    it("is re-called when a property changes", function () {
        var code = window.SurplusPreprocessor.preprocess('              \n\
            var props = null,                                           \n\
                SubComponent = p => props = p,                          \n\
                sub = <SubComponent foo="2" bar={3}/>;                  \n\
                                                                        \n\
            expect(props).toEqual({ foo: "2", bar: 3, children: [] });  \n\
        ');
        eval(code);
    });

    it("can have dotted identifiers", function () {
        var code = window.SurplusPreprocessor.preprocess('              \n\
            var props = null,                                           \n\
                a = { b: { c: { sub: p => (props = p, "sub") } } },     \n\
                sub = <a.b.c.sub foo="2" bar={3}/>;                     \n\
                                                                        \n\
            expect(sub).toEqual("sub");                                 \n\
            expect(props).toEqual({ foo: "2", bar: 3, children: [] });  \n\
        ');
        eval(code);
    });

    it("can be children with dotted identifiers", function () {
        var code = window.SurplusPreprocessor.preprocess('              \n\
            var props = null,                                           \n\
                a = { b: { c: { sub: p => (props = p, "sub") } } },     \n\
                div = <div><a.b.c.sub foo="2" bar={3}/></div>;          \n\
                                                                        \n\
            expect(div instanceof HTMLDivElement).toBe(true);           \n\
            expect(div.childNodes.length).toBe(1);                      \n\
            expect(div.childNodes[0] instanceof Text).toBe(true);       \n\
            expect(div.childNodes[0].data).toBe("sub");                 \n\
            expect(props).toEqual({ foo: "2", bar: 3, children: [] });  \n\
        ');
        eval(code);
    });
});
