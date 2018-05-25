propspec2 JSON format documentation
===================================

primitive notions
-----------------

## object IDs ##

Possible formats:

* Integer > 0, e.g. `12345`
* ASCII string containing `/[a-z_][a-z0-9_]{0,7}\./` + positive integer > 0; e.g. `"type.12345"`
* UTF8 string containing a URL ending in an integer > 0, e.g. `"https://example.com/BCO/type.12345"`

## identifiers ##

ASCII string, case-insensitive, matching `/[a-zA-Z0-9_-]+/`, e.g. `"name"`

## booleans ##

`0` and `false` are treated as false.

`1` and `true` are treated as true.

Default (if value is not specified) is false.

top-level (type) annotation
---------------------------

### _id ###

Object ID of the type object.

### name ###

Identifier. Multiple types with the same name but different IDs (different versions of the same type) will be supported in the future. But for the moment, names must be unique.

### title ###

UTF8 string, human-readable title.

### descr ###

Optional UTF8 string, human-readable description.

### _abstr ###

Optional boolean. If true, objects of this type may not be created (meaning the type exists purely as an interface).

### __is_prefetch ###

Not relevant for validation.

Optional boolean. If true, system will prefetch the type definition on startup.

### __is_user ###

Not relevant for validation.

Optional boolean. If true, objects of this type will be shown in the main HIVE explorer UI.

### __is_system ###

Validated at core system level.

Optional boolean. If true, non-admin users are not allowed to create objects of this type.

### singleton ###

Validated at core system level.

Optional integer, possible values: 0, 1, 2; 0 by default. If non-zero, an object of this type must be unique per user or per system.

### __parents ###

Not relevant for validation.

Array of names of the type object's parent types.

### __includes ###

Not relevant for validation.

List of names of the type object's includes (mixins).

### __children ###

Not relevant for validation.

Array of names of the type object's children types.

### _field ####

Object whose values (guaranteed to be unique) are field descriptions.

Field descriptions
------------------

The field name is an identifier, and is used as the key whose corresponding value is the field description:

    "my_field": { "title": "My field", "_type": "int" }

Field names are guaranteed to be unique within a given type.

### _type ###

Type of primitive value stored in the field:

* `"string"` - UTF-8 JSON string (displayed as inline)
* `"text"` - UTF-8 JSON string (displayed as text block)
* `"int"` - integer
* `"uint"` - unsigned integer
* `"real"` - floating point
* `"bool"` - boolean: `0` and `false` are false, `1` and `true` are true
* `"date"` - string representing a valid year-month-day in ISO 8601 format, e.g `"2017-05-31"`
* `"time"` - string representing a valid time in ISO 8601 format, e.g. `"17:00"` or `"17:00:30Z"` or `"17:00:30+00:00"` (timezone optional)
* `"datetime"` - string representing a valid combined date & time in ISO 8601 format, e.g. `"2017-08-24T19:32:30Z"` (timezone optional)
* `"url"` - string containing a valid URL
* `"hiveid"` - object ID (see format spec above)
* `"password"` - on input, string containing a password; on output, a placeholder, e.g. `\"*****\"` or similar
* `"file"` - string containg a filename or filepath (e.g. of a file in the same zip archive, or uploaded as form-data in the same HTML POST request, etc.)
* `"version"` - (not used yet) string containing a version number: `/([0-9]+\.)*([0-9]+)([a-z])?((_alpha|_beta|_pre|_rc|_p)([0-9]*))?/` e.g. `"1.12c"`
* `"json"` - (not used yet) arbitrary JSON object as object (not as string), e.g. `{"a":1,"b":{"c":2}}`
* `"xml"` - (not used yet) string containing valid XML
* `"blob"` - (not used yet) string containing arbitrary non-printable data

Composite fields do not have a _type.

### _layout ####

Layout of composite fields:

* `"struct"` - field's value is a json object whose keys are the struct field's children.
* `"table"` - field's value is an array/object of objects whose keys are the table field's children (displayed as a table or 2D array).

### _plural ###

Optional boolean. If true, field is an array/object of whatever is the form of values normally expected.

The interaction between _plural and struct/table tricky, so here is an example propspec fragment:

    "name": {
        "_type": "string"
    },
    "keywords": {
        "_type": "string", "_plural": true
    },
    "single_struct": {
        "_layout": "struct",
        "_children": {
            "foo": { "_type": "string" },
            "multi_foo": { "_type": "string", "_plural": true }
        }
    },
    "multi_struct": {
        "_layout": "struct",
        "is_multi": true,
        "_children": {
            "bar": { "_type": "string" },
            "multi_bar": { "_type": "string", "_plural": true }
        }
    },
    "single_table": {
        "_layout": "table",
        "_children": {
            "col1": { "_type": "int" },
            "col2": { "_type": "string" }
        }
    },
    "multi_table": {
        "_layout": "table",
        "_plural": true,
        "_children": {
            "col3": { "type": "int" },
            "col4": { "type": "string" }
        }
    }

A corresponding object value fragment might look like

    "name": "My Name",
    "keywords": [ "some", "keywords" ], // or { "1": "some", "2": "keywords" }
    
    "single_struct": { "foo": "x", "multi_foo": [ "y", "z" ] // or { "1": "y", "2": "z" } },
    // or { "foo": "x", "multi_foo": { "1": "y", "2": "z" } }
    
    "multi_struct": { "1": { "bar": "x", "multi_bar": [ "y", "z" ] } },
    // or { "1": { "bar": "x", "multi_bar": { "1": "y", "2": "z" } } }
    // or [ { "bar": "x", "multi_bar": [ "y", "z" ] } ]
    // or [ { "bar": "x", "multi_bar": { "1": "y", "2": "z" } } ]
    
    "single_table": { "1": { "col1": 1, "col2": "x" }, "2": { "col1": 2, "col2": "y" } },
    // or [ { "col1": 1, "col2": "x" }, { "col1": 2, "col2": "y" } ]
    
    "multi_table": { "1": { "1.1": { "col1": 1, "col2": "x" }, "1.2": { "col1": 2, "col2": "y" } }, "2": { { "2.1": { "col1": 3, "col2": "z" } } } }
    // or [ { "1.1": { "col1": 1, "col2": "x" }, "1.2": { "col1": 2, "col2": "y" } }, { { "2.1": { "col1": 3, "col2": "z" } } } ]
    // etc.

### __flattened_decor ###

Optional boolean. If true, it means field (of type list or array) serves only as a decorative grouping, and may be "flattened" (elided, skipped) in object format.

In other words, if `foo` is a __flattened_decor field, with children `bar` and `baz`, then the following object value fragments are equivalent:

    "foo": { "bar": 1, "baz": 2 }

    "bar": 1,
    "baz": 2

### __flattened_multi ###

Optional boolean. If true, it means the field is multi when the object is in flattened format (see discussion of is_multi and is_flattened_decor above). 

### _default ###

Not relevant for validation.

Default value (for primitive values only). By default, empty string (auto-cast to 0 for numerics, false for booleans).

### _encode ###

Not relevant for validation.

Integer code indicating how to encode or encrypt the value for storage. 0 by default.

### title ###

UTF8 string, human-readable title.

### descr ###

Optional UTF8 string, human-readable description.

### _order ###

Not relevant for validation.

Optional real value, indicating the sort order of the field for display.

### _is_key ###

Optional boolean.

If true: 

* for top-level fields: only one object of a given type with the given tuple of values may exist on the system.
* for non-top-level fields: only one field of this name with this value may exist in the object.

### _write ###

Optional (`true` by default). Possible values:

* `true` or `1` (this is the default) - field is read-write
* `false` or `0` - field is readonly.
* `"once"` - field can be changed (from the default value) on new object creation; readonly for existing objects.
* `"noresub"` - field can be changed (from the default value) on new object creation, unless the new object is a resubmission of another computation, in which case the field value is copied from the old computation with the user not being allowed to modify it (in practice, this constraint can only be enforced at the UI level). Readonly for existing objects.
* `"onlyauto"` - field cannot be modified by the user - only automatically by the system backend. Attempting to write such a field is a silent no-op.

Unless field is _write is `"onlyauto"` (or _vital is false and the field value is empty), the UI *must* submit this field to the system in the propspec JSON object.

### _vital ###

Optional boolean, `true` by default. If false, field value is allowed to be omitted.

### _hidden ###

Not relevant for validation.

Optional boolean. If true, field is hidden by the UI.

### _public ###

Not relevant for validation.

Optional boolean. If true, field is used by the UI when displaying a short summary view of the object.

### _virtual ####

Not relevant for validation.

Optional boolean. If true, field value is not stored, but is calculated dynamically by the system; attempts to change the value may be a no-op or may have special side effects.

### _batched ###

Not relevant for validation.

Optional boolean. If true, field can be batched on when submitting a batch computation.

### _weakref ###

Not relevant for validation.

Optional boolean. If true, field value is not treated as a dependency of the current object (relevant for fields of type obj/objectid)

### brief ###

Not relevant for validation.

Optional UTF8 format string specifying a one-line brief description of the object.

### _limit ###

Optional JSON object specifying constraints for primitive values. Possible keys:

* `"choice"` - choice of values; the specification is an array of individual values and/or JSON objects with keys `"value"` and `"title"` with the obvious meaning; e.g. `"choice": [ 2, 4, { "value": 8, "title": "8 (recommended)"} ]` means values can be 2, 4, or 8, which will be displayed to the user as "2", "4", or "8 (recommended)" respectively
* `"choice+"` - no constraint (UI allows user to select from a set of choices - presented from a constraint specification in the same format same as for `"search"` - or enter a custom value)
* `"regexp"` - regular expression match; the specification is a UTF-8 string containing a valid regular expression.
* `"range"` - numeric range, specified by an object with `"min"` / `"max"` / `"exclusive"` keys (each of the keys is optional); e.g `{ "min": 0, "exclusive": true }` means value must be greater than 0
* `"search"` - choice of values or objects retrieved from a URL (in practice, this can only be checked at the UI level). The search specification is an object with the following keys:
  * `"url"` - the url (can be a relative url!) from which to retrieve values
  * `"format"` - data format retrieved from the url (`"json"` or `"csv"`)
  * `"value"` - optional column name in csv or field name in json to retrieve as the field's value (default is to try `"_id"` and `"id"`)
  * `"title"` - optional column name in csv or field name in json to retrieve as the field's title
  * `"show"` - optional list of column names and/or of `{"name": ..., "title": ...}` objects, describing the columns / field names to display in the UI for selecting search results. For example: `[ { "name": "_id", "title": "sequence ID" }, "name", "version" ]`
  * `"qryLang"`, `"explorer"` - UI-specific options
* `"search+"` - no constraint (UI allows user to select from a set of choices - presented from a constraint specification in the same format same as for `"search"` - or enter a custom value)
* `"type"` - any object matching specified types; the constraint specification is a string containing a comma-separated list of regexps matching type names, each one optionally prefixed with `!` to negate and/or suffixed with `+` indicating the type(s) matching the regexp or any of its (their) descendents; e.g. `"^genome$+,folder"` to match objects of type `genome`, or of any type descending from `genome`, or any type with `folder` as a substring in the name.
* `"eval"` - value must be matched by a JavaScript expression; constraint specification is a string template which is preprocessed (substituting `$val` or `${_val}` with the field value) and evaluated as JavaScript (with the return value cast to boolean, true meaning valid and false invalid); e.g. `"$val > 0 && $val % 2 == 0"`
* `"descr"` - optional UTF-8 string documenting the constraint for the user.

Examples:

    "nmer_length": {
        "_type": "int",
        "_default": 18
        "_limit": {
            "range": {
                "min": 1, "max": 20
            },
            "desc": "Enter a valid nmer length"
        }
    },
    "format": {
        "_type": "string",
        "_default": "old",
        "_limit": {
            "choice": [ { "value": "old", "title": "Old format" }, { "value": "new", "title": "New format (experimental)" } ]
        }
    },
    "sequence": {
        "_type": "hiveid",
        "_limit": {
            "type": "^genome$+"
        }
    }

### link_url ###

Not relevant for validation.

An optional UTF-8 string template which is preprocessed (substituting `$val` or `${_val}` with the field value) and used as a URL for a link in the user interface.

### __definer_type ###

Not relevant for validation.

Object ID of type that defined this field (may be different from current type due to inheritance etc.)

### __included_from_type ###

Not relevant for validation.

Object ID of type from which this field was included via field of type `"type"`.

### _field ###

Array of the field's children (for struct and table fields)