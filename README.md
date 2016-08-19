# babel-plugin-uncommon-transform

Transform CommonJS require() into ES2015 imports

### Example

Input code:

	require('lodash').range(10)

	var express = require('express')

Result:

	import _lodash from 'lodash';
	_lodash.range(10)

	import _express from 'express';
	var express = _express;

