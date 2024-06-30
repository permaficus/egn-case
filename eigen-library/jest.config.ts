import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'
import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/**/*.e2e-spec.ts"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
}

export default jestConfig

// const tsconfig = require('./tsconfig.json');
// const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

// module.exports = {
//     moduleNameMapper,
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     rootDir: './',
//     testMatch: ["**/**/*.e2e-spec.ts"]
// }