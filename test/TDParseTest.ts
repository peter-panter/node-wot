/*
 * The MIT License (MIT)
 * Copyright (c) 2017 the thingweb community
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Basic test suite for TD parsing
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import ThingDescription from "../src/td/thing-description";
import * as TDParser from "../src/td/td-parser";

/** sample TD json-ld string from the CP page*/
let td_cpexample_jsonld = '{"@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],"@type": "Thing","name": "MyTemperatureThing","interactions": [{"@type": ["Property"],"name": "temperature","outputData": {"valueType": { "type": "number" }},"writable": false,"links": [{"href" : "coap://mytemp.example.com:5683/temp","mediaType": "application/json"}]}]}';


@suite("TD parsing/serialising")
class TDParserTest {

    @test "should parse the example from Current Practices"() {
        let td : ThingDescription = TDParser.parseTDString(td_cpexample_jsonld)

        //BDD style expect
        expect(td.name).to.equal("MyTemperatureThing")
        expect(td.interactions).to.have.lengthOf(1);
        expect(td.interactions[0]).to.have.property('name').that.equals("temperature")

        //BDD style should
        td.interactions[0].links.should.have.lengthOf(1)
        td.interactions[0].links[0].should.have.property('mediaType').equal("application/json")
        td.interactions[0].links[0].href.should.equal("coap://mytemp.example.com:5683/temp")
    }

    @test "should return same TD in round-trip"() {
        let td : ThingDescription = TDParser.parseTDString(td_cpexample_jsonld)
        let newJson = TDParser.serializeTD(td);

        let json_expected = JSON.parse(td_cpexample_jsonld);
        let json_actual = JSON.parse(newJson);

        expect(json_actual).to.deep.equal(json_expected);
    }

}