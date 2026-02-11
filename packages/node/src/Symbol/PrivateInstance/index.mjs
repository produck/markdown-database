export * as ASSERT from './Assert.mjs';
export * as SIBLING from './Sibling.mjs';
export * as CHILD from './Child.mjs';
export * as IS from './Is.mjs';

export const CONSTRUCTOR = Symbol('.#constructor');
export const PARENT = Symbol('.#parent');
export const NAME = Symbol('.#name');
export const DATA = Symbol('.#data');
export const READABLE_NAME = Symbol('.#readableName');
export const CONTAINS = Symbol('.#contains()');
export const DETACH = Symbol('.#detach()');
