module.exports = {
  roots: ["<rootDir>/src"],
  collectCoverage: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"]
  // preset: '@shelf/jest-mongodb',
};
