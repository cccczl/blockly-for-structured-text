'use strict';

goog.provide('Blockly.ST.logic');

goog.require('Blockly.ST');

Blockly.ST['controls_if'] = function (block) {

    var n = 0;
    var code = '', conditionCode, branchCode;
    do {
        conditionCode = Blockly.ST.valueToCode(block, 'IF' + n,
            Blockly.ST.ORDER_NONE) || 'FALSE';
        branchCode = Blockly.ST.statementToCode(block, 'DO' + n);
        code += (n > 0 ? 'ELS' : '') +
            'IF ' + conditionCode + ' THEN\n\t' + branchCode + '\n';

        ++n;
    } while (block.getInput('IF' + n));

    if (block.getInput("ELSE")) {
        branchCode = Blockly.ST.statementToCode(block, 'ELSE');
        code += "ELSE\n\t" + branchCode + "\n";
    }
    return code + "END_IF;\n";
};

Blockly.ST['controls_ifelse'] = Blockly.ST['controls_if'];

Blockly.ST['logic_compare'] = function (block) {
    var OPERATORS = {
        'EQ': '=',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>='
    };
    var operator = OPERATORS[block.getFieldValue('OP')];
    var order = (operator === '==' || operator === '!=') ?
        Blockly.ST.ORDER_EQUALITY : Blockly.ST.ORDER_RELATIONAL;
    var argument0 = Blockly.ST.valueToCode(block, 'A', order) || '0';
    var argument1 = Blockly.ST.valueToCode(block, 'B', order) || '0';

    var code = argument0 + " " + operator + " " + argument1;
    return [code, order];
};

Blockly.ST['logic_boolean'] = function (block) {
    var code = (block.getFieldValue('BOOL') === 'TRUE') ? 'TRUE' : 'FALSE';
    return [code, Blockly.ST.ORDER_ATOMIC];
};

Blockly.ST['logic_operation'] = function (block) {
    var operator = block.getFieldValue('OP');
    var order;
    if (operator === "AND") {
        order = Blockly.ST.ORDER_BITWISE_AND;
    } else if (operator === "OR") {
        order = Blockly.ST.ORDER_BITWISE_OR;
    } else if (operator === "XOR") {
        order = Blockly.ST.ORDER_BITWISE_XOR;
    }
    var argument0 = Blockly.ST.valueToCode(block, 'A', order);
    var argument1 = Blockly.ST.valueToCode(block, 'B', order);

    var code = argument0 + " " + operator + " " + argument1;
    return [code, order];
};

Blockly.ST['logic_negate'] = function (block) {
    var order = Blockly.ST.ORDER_UNARY_NEGATION;
    var argument0 = Blockly.ST.valueToCode(block, 'BOOL', order) || 'TRUE';
    var code = 'NOT ' + argument0;
    return [code, order];
};

Blockly.ST['logic_switch'] = function (block) {
    var variable = Blockly.ST.valueToCode(block, 'IF', Blockly.ST.ORDER_NONE) || 'FALSE';
    var code = 'CASE ' + variable + ' OF\n';

    var n = 1;
    var conditionCode, branchCode;
    do {
        conditionCode = Blockly.ST.valueToCode(block, 'CASE' + n,
            Blockly.ST.ORDER_NONE) || 'FALSE';
        branchCode = Blockly.ST.statementToCode(block, 'DO' + n);
        code += conditionCode + ':\n\t' + branchCode + "\n";
        n++;
    } while (block.getInput('CASE' + n));
    if(block.getInput('DEFAULT')){
        branchCode = Blockly.ST.statementToCode(block, 'DEFAULT');
        code += 'ELSE\n\t'+branchCode+"\n";
    }
    code += "END_CASE;\n";
    return code;
};

Blockly.ST['logic_ternary'] = function (block) {
    var condition = Blockly.ST.valueToCode(block, 'IF', Blockly.ST.ORDER_NONE) || 'FALSE';
    var branchTrue = Blockly.ST.valueToCode(block, 'THEN', Blockly.ST.ORDER_NONE);
    var branchFalse = Blockly.ST.valueToCode(block, 'ELSE', Blockly.ST.ORDER_NONE);

    var code = 'SEL(G:'+condition+", IN0:"+branchFalse+" ,IN1:"+branchTrue+')';
    return [code, Blockly.ST.ORDER_FUNCTION_CALL];

};

Blockly.ST['logic_bit_shift'] = function(block) {
    var FUNCTIONS = {
        'LEFT': 'SHL',
        'RIGHT': 'SHR',
        'ROT_RIGHT': 'ROR',
        'ROT_LEFT': 'ROL'
    };

    var func = FUNCTIONS[block.getFieldValue('DIR')];
    var value_in = Blockly.ST.valueToCode(block, 'IN', Blockly.ST.ORDER_ATOMIC) || '0';
    var value_bits = Blockly.ST.valueToCode(block, 'BITS', Blockly.ST.ORDER_ATOMIC) || '0';


    // TODO: Assemble JavaScript into code variable.
    var code = func + "(IN:="+value_in+", "+"N:="+value_bits+")";
    return code;
};