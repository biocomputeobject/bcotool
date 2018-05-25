// Learn more about configuring this file at <https://theintern.github.io/intern/#configuration>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites
define({
	// Default desired capabilities for all environments. Individual capabilities can be overridden by any of the
	// specified browser environments in the `environments` array below as well. See
	// <https://theintern.github.io/intern/#option-capabilities> for links to the different capabilities options for
	// different services.
	//
	// Note that the `build` capability will be filled in with the current commit ID or build tag from the CI
	// environment automatically
	capabilities: {
		'browserstack.selenium_version': '2.45.0'
	},

	// Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
	// OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
	// capabilities options specified for an environment will be copied as-is
	environments: [
		{ browserName: 'internet explorer', version: '11', platform: 'WIN8' },
		{ browserName: 'internet explorer', version: '10', platform: 'WIN8' },
		{ browserName: 'internet explorer', version: '9', platform: 'WINDOWS' },
		{ browserName: 'firefox', version: '37', platform: [ 'WINDOWS', 'MAC' ] },
		{ browserName: 'chrome', version: '39', platform: [ 'WINDOWS', 'MAC' ] },
		{ browserName: 'safari', version: '8', platform: 'MAC' }
	],

	// Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
	maxConcurrency: 2,

	// Name of the tunnel class to use for WebDriver tests.
	// See <https://theintern.github.io/intern/#option-tunnel> for built-in options
	tunnel: 'BrowserStackTunnel',

	// Configuration options for the module loader; any AMD configuration options supported by the AMD loader in use
	// can be used here.
	// If you want to use a different loader than the default loader, see
	// <https://theintern.github.io/intern/#option-useLoader> for instruction
	loaderOptions: {
		// Packages that should be registered with the loader in each testing environment
		packages: [ 
			{ 
				name: 'myPackage', 
				location: 'path/to/myPackage' 
			}
		]
	},

	// Non-functional test suite(s) to run in each browser
	suites: [

		// UNIT TESTS

		// 'tests/unit/get/get/test',

		// 'tests/unit/hive/getdefaults/test',
		// 'tests/unit/hive/checkfields/test',
		// 'tests/unit/hive/checkrequired/test',
		// 'tests/unit/hive/validateattributes/test',
		// 'tests/unit/hive/validatefield/test',
		// 'tests/unit/hive/validate/test',

		// 'tests/unit/limit/limittype/test',

		// 'tests/unit/propspec/checkrequired/test',
		// // 'tests/unit/propspec/checktoplevel/test',
		// // 'tests/unit/propspec/validate/test',
		// 'tests/unit/propspec/validateattributes/test',

		// 'tests/unit/datatype/datatypedefined/test',
		// 'tests/unit/datatype/missingrequired/test',
		// 'tests/unit/datatype/recursivevalidate/test',
		// 'tests/unit/datatype/validate/test',
		// 'tests/unit/datatype/validatevalues/test',

		// 'tests/unit/bco/getdefinition/test',
		// 'tests/unit/bco/recursivevalidate/test',

		// 'tests/unit/common/ischild/test',
		// 'tests/unit/common/supportedfield/test',

		// 'tests/unit/primitives/validatehiveregex/test',
		// 'tests/unit/primitives/validatehivearray/test',
		// 'tests/unit/primitives/validatearray/test',
		// 'tests/unit/primitives/validateobjectid/test',
		// 'tests/unit/primitives/validatedate/test',
		// 'tests/unit/primitives/validatedatetime/test',
		// 'tests/unit/primitives/validateregex/test',
		// 'tests/unit/primitives/validateuint/test',

		// 'tests/unit/util/jsonfiletodata/test',


		// INTEGRATION TESTS

		'tests/integration/limit/limittype/test',


 	],

	// Functional test suite(s) to execute against each browser once non-functional tests are completed
	functionalSuites: [ /* 'myPackage/tests/functional' */ ],

	// A regular expression matching URLs to files that should not be included in code coverage analysis
	excludeInstrumentation: /^(node_modules|tests)\//
});
