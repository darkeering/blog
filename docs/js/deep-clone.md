---
title: 手写简易 Deep Clone
date: 2023-04-18 00:00:33
---

## 数据基本类型

- 使用 `typeof` 来判断数据类型

  ```typescript
  typeof "a"; // 'string'
  typeof 1; // 'number'
  typeof true; // 'boolean'
  typeof function () {}; // 'function'
  typeof Symbol("a"); // 'symbol'
  typeof undefined; // 'undefined'

  typeof null; // 'object'
  typeof {}; // 'object'
  typeof []; // 'object'
  typeof new Map(); // 'object'
  typeof new Set(); // 'object'
  typeof new date(); // 'object'
  typeof new Error(""); // 'object'
  typeof /[a-z]/g; // 'object'
  ```

- 使用 `Object.prototype.tostring` 来判断数据类型

  ```typescript
  Object.prototype.tostring.call("a"); // "[object String]"
  Object.prototype.tostring.call(1); // "[object Number]"
  Object.prototype.tostring.call(true); // "[object Boolean]"
  Object.prototype.tostring.call(null); // "[object Null]"
  Object.prototype.tostring.call(undefined); // "[object Undefined]"

  Object.prototype.tostring.call({}); // "[object Object]"
  Object.prototype.tostring.call([]); // "[object Array]"
  Object.prototype.tostring.call(new Map()); // "[object Map]"
  Object.prototype.tostring.call(new Set()); // "[object Set]"

  Object.prototype.tostring.call(new Date()); // "[object Date]"
  Object.prototype.tostring.call(function () {}); // "[object Function]"
  Object.prototype.tostring.call(new Error("a")); // "[object Error]"
  Object.prototype.tostring.call(/[a-z]/g); // "[object RegExp]"
  Object.prototype.tostring.call(Symbol("a")); // "[object Symbol]"
  ```

## Deep Clone

```typescript
const _object = "[object Object]";
const _array = "[object Array]";
const _map = "[object Map]";
const _set = "[object Set]";
const canDeepthSet = new Set([_object, _array, _map, _set]);

function cloneDeep(data, map = new WeakMap()) {
  // clone 基础类型
  if (!isObject) {
    return data;
  }
  // clone 可循环迭代的类型
  const dataType = Object.prototype.toString.call(data);
  if (map.has(data)) {
    return map.get(data);
  }
  let _cloneData;
  map.set(data, _cloneData);
  if (canDeepthSet.has(dataType)) {
    _cloneData = new data.constructor();
    switch (dataType) {
      case _array:
      case _object: {
        for (let key in data) {
          _cloneData[key] = cloneDeep(data.key, map);
        }
      }
      case _map: {
        data.forEach((value, key) => {
          _cloneData.set(key, cloneDeep(value, map));
        });
      }
      case _set: {
        data.forEach((value) => {
          _cloneData.add(cloneDeep(value));
        });
      }
    }
    return _cloneData;
  }

  // clone 其他类型
  return cloneOtherType(data);
}

function isObject(data) {
  const _type = typeof data;
  return _type !== null && (_type === "object" || _type === "function");
}

function cloneOtherType(data) {
  switch (dataType) {
    case _error:
    case _date: {
      return new data.constructor(data);
    }
    case _function: {
      return new Function("return " + data.toString())();
    }
    case _symbol: {
      return Symbol(data.description);
    }
    case _regexp: {
      return cloneRegExp(data);
    }
  }
}

function cloneRegExp(regexp) {
  const reFlags = /\w*$/;
  const _cloneRegExp = new regexp.constructor(
    regexp.source,
    reFlags.exec(regexp)
  );
  _cloneRegExp.lastIndex = regexp.lastIndex;
  return _cloneRegExp;
}
```
