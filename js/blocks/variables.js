/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Variable blocks for Blockly.

 * This file is scraped to extract a .json file of block definitions. The array
 * passed to defineBlocksWithJsonArray(..) must be strict JSON: double quotes
 * only, no outside references, no functions, no trailing commas, etc. The one
 * exception is end-of-line comments, which the scraper will remove.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.variables');  // Deprecated.
goog.provide('Blockly.Constants.Variables');

goog.require('Blockly.Blocks');
goog.require('Blockly');


/**
 * Unused constant for the common HSV hue for all blocks in this category.
 * @deprecated Use Blockly.Msg.VARIABLES_HUE. (2018 April 5)
 */
Blockly.Constants.Variables.HUE = 330;

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
    // Block for variable setter.
    {
        "type": "variables_local",
        "message0": "Local variables %1 %2",
        "args0": [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "VARIABLES",
                "check": null
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "variables_global",
        "message0": "Global variables %1 %2",
        "args0": [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "VARIABLES",
                "check": null
            }
        ],
        "colour": 230,
        "tooltip": "",
        "helpUrl": ""
    },
]);  // END JSON EXTRACT (Do not delete this comment.)

/** Declare a new variable block **/
Blockly.Blocks['variables_declare'] = {
    init: function () {
        var TYPES = [
            ['INT', 'INT'],
            ['REAL', 'REAL'],
            ['BOOL', 'BOOL']
        ];
        var name = Blockly.Procedures.findLegalName("myVariable", this);
        this.appendDummyInput()
            .appendField("new");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(TYPES), "TYPE");
        this.appendDummyInput()
            .appendField("variable");
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput(name), "NAME");
        this.appendDummyInput()
            .appendField("init with");
        this.appendValueInput("VALUE")
            .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    },

    onchange: function () {
        var type = this.getFieldValue('TYPE');
        if (type === false) {
            type = 'INT';
        }
        this.getInput('VALUE').setCheck(type);
    },

};

Blockly.Blocks['variables_get'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldVariable("item"), "VAR");
        this.setOutput(true);
        this.setColour(330);
        this.setTooltip("Returns the value of this variable.");
        this.setHelpUrl("https://github.com/google/blockly/wiki/Variables#get");
    },

    onchange: function () {
        var variable = this.getField('VAR').variable_;
        this.setOutput(true, variable.type);
    }
};

Blockly.Blocks['variables_set'] = {
    init: function () {
        this.appendValueInput("VALUE")
            .setCheck(null)
            .appendField("set")
            .appendField(new Blockly.FieldVariable("item"), "VAR")
            .appendField("to");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(330);
        this.setTooltip("Sets this variable to be equal to the input.");
        this.setHelpUrl("https://github.com/google/blockly/wiki/Variables#set");
    },

    onchange: function () {
        var variable = this.getField('VAR').variable_;
        this.getInput('VALUE').setCheck(variable.type);
    },
};

/**
 * Mixin to add context menu items to create getter/setter blocks for this
 * setter/getter.
 * Used by blocks 'variables_set' and 'variables_get'.
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 */
Blockly.Constants.Variables.CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN = {
    /**
     * Add menu option to create getter/setter block for this setter/getter.
     * @param {!Array} options List of menu options to add to.
     * @this Blockly.Block
     */
    customContextMenu: function (options) {
        if (this.isInFlyout) {
            return;
        }
        // Getter blocks have the option to create a setter block, and vice versa.
        if (this.type == 'variables_get') {
            var opposite_type = 'variables_set';
            var contextMenuMsg = Blockly.Msg.VARIABLES_GET_CREATE_SET;
        } else {
            var opposite_type = 'variables_get';
            var contextMenuMsg = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        }

        var option = {enabled: this.workspace.remainingCapacity() > 0};
        var name = this.getField('VAR').getText();
        option.text = contextMenuMsg.replace('%1', name);
        var xmlField = goog.dom.createDom('field', null, name);
        xmlField.setAttribute('name', 'VAR');
        var xmlBlock = goog.dom.createDom('block', null, xmlField);
        xmlBlock.setAttribute('type', opposite_type);
        option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
        options.push(option);
    }
};

Blockly.Extensions.registerMixin('contextMenu_variableSetterGetter',
    Blockly.Constants.Variables.CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN);
