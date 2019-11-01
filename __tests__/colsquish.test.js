const colsquish = require('../colsquish');

it("should find all columns with the same header", () => {
    const haystack = [
        ["name", "needles", "height", "needles", "needles", "age"],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
    ];

    const columnIndices = colsquish.findColumns(haystack, "needles");

    expect(columnIndices).toStrictEqual([1,3,4]);
});

it("should extract the columns", () => {
    const originalSheet = [
        ["name", "needles", "height", "needles"],
        ["one",  "two", "three", "four"],
        ["one", "two", "three", "four"],
        ["one", "two", "three", "four"],
    ];
    const expected = [
        [ "needles", "needles"],
        ["two",  "four"],
        [ "two", "four"],
        ["two", "four"],       
    ]
    const extractedColumns = colsquish.extractColumns(originalSheet, "needles");

    expect(extractedColumns).toStrictEqual(expected);
});


it("should create one column from many", () => {
    const many = [
        ["needles", "needles", "needles"],
        ["one", "", ""],
        ["", "two", ""],
        ["", "", "three"],
        ["", "", ""]       
    ];

    const expectedColumn = [       
        ["needles"],
        ["one"],
        ["two"],
        ["three"],
        [""] 
    ];

    const testColumn = colsquish.createOneColumnFromMany(many);

    expect(testColumn).toStrictEqual(expectedColumn);
});

it("should remove all columns with a specific header", () => {
    const originalSheet = [
        ["name", "needles", "height", "needles"],
        ["one", "two", "three", "four"],
        ["one", "two", "three", "four"],
        ["one", "two", "three", "four"],
    ];

    const expectedSheet = [
        ["name", "height"],
        ["one", "three"],
        ["one", "three"],
        ["one", "three"],
    ];

    const newSheet = colsquish.removeColumns(originalSheet, "needles");

    expect(newSheet).toStrictEqual(expectedSheet);
});

it("should insert a new column in a specific location", () => {

    const originalSheet = [
        ["name", "height"],
        ["one", "three"],
        ["one", "three"],
        ["one", "three"],
    ];    

    const expectedSheet = [
        ["name", "needle", "height"],
        ["one", "two", "three"],
        ["one", "two", "three"],
        ["one", "two", "three"],
    ];    

    const newColumn = [
        ["needle"],
        ["two"],
        ["two"],
        ["two"]
    ];

    const testSheet = colsquish.insertNewColumn(originalSheet, newColumn, 1);

    expect(testSheet).toStrictEqual(expectedSheet);
});

it("should merge all the columns of the same name together", () => {
    const originalSheet = [
        ["name", "height", "needles", "needles"],
        ["one", "two", "three", ""],
        ["one", "two", "", "four"],
        ["one", "two", "three", ""],
    ];

    const expectedSheet = [
        ["name", "height", "needles"],
        ["one", "two", "three"],
        ["one", "two", "four"],
        ["one", "two", "three"],
    ];

    const testSheet = colsquish.squish(originalSheet, "needles");

    expect(testSheet).toStrictEqual(expectedSheet);    

});