define(["require", "exports", "@syncfusion/ej2-base/dom", "../../src/list-view/list-view", "@syncfusion/ej2-data", "../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, list_view_1, ej2_data_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataSource = [
        {
            id: '01', text: 'text1', icon: 'iconClass1', category: 'a',
            child: [{ id: '01_1', text: 'subText1', icon: 'iconSubClass1', category: 'a' },
                { id: '01_2', text: 'subText2', icon: 'iconSubClass2', category: 'b' },
                { id: '01_3', text: 'subText3', icon: 'iconSubClass3', category: 'a' }]
        },
        {
            id: '02', text: 'text2', icon: 'iconClass2', category: 'b',
            child: [{
                    id: '02_1', text: 'subText1', icon: 'iconSubClass1', category: 'a',
                    child: [{ id: '02_1_1', text: 'subText1', icon: 'iconSubClass1', category: 'a' }]
                },
                { id: '02_2', text: 'subText2', icon: 'iconSubClass2', category: 'b' },
                { id: '02_3', text: 'subText3', icon: 'iconSubClass3', category: 'a' }]
        },
        {
            id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
        }
    ];
    describe('ListView', function () {
        describe('Local Data Binding', function () {
            var treeObj;
            var ele = dom_1.createElement('div', { id: 'ListView' });
            beforeAll(function () {
                document.body.appendChild(ele);
                treeObj = new list_view_1.ListView({ dataSource: dataSource });
                treeObj.appendTo(ele);
            });
            it('default initialize', function () {
                expect(ele.childNodes.length).not.toBe(0);
            });
            it('class name', function () {
                expect(ele.classList.contains('e-listview')).toBe(true);
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('HTMLData Data Binding', function () {
            var ele = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            ele.querySelector('ul').innerHTML =
                '<li id="i1">item1<ul><li id="s1">sub1</li><li id="s2">sub2</li><li id="s3">sub3</li></ul></li>' +
                    '<li id="i2" style="display:none">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
                    '<li>item6</li><li>item7</li>';
            var nTree;
            beforeAll(function () {
                document.body.appendChild(ele);
                nTree = new list_view_1.ListView();
                nTree.appendTo('#newTree');
            });
            it('initialized HTML data', function () {
                expect(ele.querySelectorAll('.e-list-item').length).toBe(7);
                expect(nTree.dataSource.length).not.toBe(0);
            });
            it('getSubDS', function () {
                expect(nTree.getSubDS()).toBe(nTree.dataSource);
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('HTMLData Without UL and LI', function () {
            var ele = document.createElement('div');
            ele.id = 'newTree';
            var nTree;
            beforeAll(function () {
                document.body.appendChild(ele);
                nTree = new list_view_1.ListView();
                nTree.appendTo('#newTree');
            });
            it('initialized HTML data', function () {
                expect(ele.querySelectorAll('.e-list-item').length).toBe(0);
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('Remote Data Binding', function () {
            describe('default query', function () {
                var ele = document.createElement('div');
                ele.appendChild(document.createElement('ul'));
                ele.id = 'newTree';
                var nTree;
                beforeAll(function (done) {
                    document.body.appendChild(ele);
                    nTree = new list_view_1.ListView({
                        dataSource: new ej2_data_1.DataManager({
                            url: '/api/Employees',
                            adaptor: new ej2_data_1.ODataV4Adaptor
                        }),
                        fields: { id: 'EmployeeID', text: 'FirstName' },
                        actionComplete: function () {
                            done();
                        }
                    });
                    nTree.appendTo('#newTree');
                });
                it('initialized HTML data', function () {
                    expect(ele.querySelectorAll('.e-list-item').length).toBe(9);
                });
                afterAll(function () {
                    ele.remove();
                });
            });
            describe('custom table name fields', function () {
                var ele = document.createElement('div');
                ele.appendChild(document.createElement('ul'));
                ele.id = 'newTree';
                var nTree;
                beforeAll(function (done) {
                    document.body.appendChild(ele);
                    nTree = new list_view_1.ListView({
                        dataSource: new ej2_data_1.DataManager({
                            url: '/api',
                            adaptor: new ej2_data_1.ODataV4Adaptor
                        }),
                        fields: { id: 'EmployeeID', text: 'FirstName', tableName: 'Employees' },
                        actionComplete: function () {
                            done();
                        }
                    });
                    nTree.appendTo('#newTree');
                });
                it('initialized HTML data', function () {
                    expect(ele.querySelectorAll('.e-list-item').length).toBe(9);
                });
                afterAll(function () {
                    ele.remove();
                });
            });
            describe('custom query name fields', function () {
                var ele = document.createElement('div');
                ele.appendChild(document.createElement('ul'));
                ele.id = 'newTree';
                var nTree;
                beforeAll(function (done) {
                    document.body.appendChild(ele);
                    nTree = new list_view_1.ListView({
                        dataSource: new ej2_data_1.DataManager({
                            url: '/api',
                            adaptor: new ej2_data_1.ODataV4Adaptor
                        }),
                        query: new ej2_data_1.Query().from('Employees').select(['EmployeeID', 'FirstName']).take(5),
                        fields: { id: 'EmployeeID', text: 'FirstName' },
                        actionComplete: function () {
                            done();
                        }
                    });
                    nTree.appendTo('#newTree');
                });
                it('initialized HTML data', function () {
                    expect(ele.querySelectorAll('.e-list-item').length).toBe(5);
                });
                afterAll(function () {
                    ele.remove();
                });
            });
        });
        describe('methods', function () {
            var treeObj;
            var ele = dom_1.createElement('div', { id: 'ListView' });
            beforeAll(function () {
                document.body.appendChild(ele);
                treeObj = new list_view_1.ListView({
                    dataSource: dataSource
                });
                treeObj.appendTo(ele);
            });
            it('get module name', function () {
                expect(treeObj.getModuleName()).toBe('listview');
            });
            it('hover previous sibling li when nothing is selected', function () {
                var ele = treeObj.element;
                var li = ele.querySelectorAll('li');
                expect(li[2].classList.contains('e-hover')).toBe(false);
                treeObj.hoverSiblingLI(true);
                expect(li[2].classList.contains('e-hover')).toBe(true);
            });
            it('hover next sibling li when nothing is selected', function () {
                var ele = treeObj.element;
                var li = ele.querySelectorAll('li');
                treeObj.removeHover();
                expect(li[0].classList.contains('e-hover')).toBe(false);
                treeObj.hoverSiblingLI();
                expect(li[0].classList.contains('e-hover')).toBe(true);
                treeObj.removeHover();
            });
            it('set hover li', function () {
                var ele = treeObj.element;
                var li = ele.querySelector('li');
                expect(li.classList.contains('e-hover')).toBe(false);
                treeObj.setHoverLI(li);
                expect(li.classList.contains('e-hover')).toBe(true);
            });
            it('set hover next sibling LI', function () {
                var ele = treeObj.element;
                var li = ele.querySelectorAll('li')[1];
                expect(li.classList.contains('e-hover')).toBe(false);
                treeObj.hoverSiblingLI();
                expect(li.classList.contains('e-hover')).toBe(true);
            });
            it('set hover previous sibling LI', function () {
                var ele = treeObj.element;
                var li = ele.querySelector('li');
                expect(li.classList.contains('e-hover')).toBe(false);
                treeObj.hoverSiblingLI(true);
                expect(li.classList.contains('e-hover')).toBe(true);
            });
            it('set hover li without element', function () {
                var ele = treeObj.element;
                var li = ele.querySelector('li');
                expect(li.classList.contains('e-hover')).toBe(true);
                treeObj.setHoverLI();
                expect(li.classList.contains('e-hover')).toBe(true);
            });
            it('remove hover', function () {
                var ele = treeObj.element;
                var li = ele.querySelector('li');
                expect(li.classList.contains('e-hover')).toBe(true);
                treeObj.removeHover();
                expect(li.classList.contains('e-hover')).toBe(false);
            });
            it('remove hover when no hovered element', function () {
                var ele = treeObj.element;
                var li = ele.querySelectorAll('.e-hover');
                expect(li.length).toBe(0);
                treeObj.removeHover();
                li = ele.querySelectorAll('.e-hover');
                expect(li.length).toBe(0);
            });
            it('remove select', function () {
                var ele = treeObj.element;
                var li = ele.querySelector('li');
                treeObj.removeSelect();
                expect(li.classList.contains('e-hover')).toBe(false);
            });
            it('select item', function (done) {
                var ele = treeObj.element;
                var li = ele.querySelector('li');
                expect(li.classList.contains('e-active')).toBe(false);
                treeObj.actionComplete = function () {
                    done();
                };
                treeObj.selectItem(li);
                expect(li.classList.contains('e-active')).toBe(true);
            });
            it('set hover li when it already selected', function () {
                var ele = treeObj.element;
                var li = ele.querySelector('li');
                expect(li.classList.contains('e-hover')).toBe(false);
                treeObj.setHoverLI(li);
                expect(li.classList.contains('e-hover')).toBe(false);
            });
            it('set select li allready selected li', function () {
                var ele = treeObj.element;
                var li = ele.querySelector('li');
                expect(li.classList.contains('e-active')).toBe(true);
                treeObj.setSelectLI(li);
                expect(li.classList.contains('e-active')).toBe(true);
            });
            it('getSelectedItem method', function () {
                var li = ele.querySelector('li');
                var data = {
                    item: li, text: 'text1', data: {
                        id: '01', text: 'text1', icon: 'iconClass1', category: 'a', child: [
                            { id: '01_1', text: 'subText1', icon: 'iconSubClass1', category: 'a' },
                            { id: '01_2', text: 'subText2', icon: 'iconSubClass2', category: 'b' },
                            { id: '01_3', text: 'subText3', icon: 'iconSubClass3', category: 'a' }
                        ]
                    }
                };
                expect(treeObj.getSelectedItem()).toEqual(data);
            });
            describe('back', function () {
                var mouseEventArgs = {
                    preventDefault: function () { },
                    target: null
                };
                var curUL;
                beforeEach(function (done) {
                    var backButtonEle = dom_1.createElement('div', { className: 'e-back' });
                    mouseEventArgs.target = backButtonEle;
                    curUL = treeObj.curUL;
                    treeObj.back();
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('mouse click on back button', function () {
                    expect(dom_1.isVisible(curUL)).toBe(false);
                });
            });
            it('disableItem method', function () {
                treeObj.disableItem({ id: '02' });
                expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(true);
            });
            it('disableItem when allready disabled', function () {
                treeObj.disableItem({ id: '02' });
                expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(true);
            });
            it('enableItem method', function () {
                expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(true);
                treeObj.enableItem({ id: '02' });
                expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(false);
            });
            it('enableItem when already enabled method', function () {
                expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(false);
                treeObj.enableItem({ id: '02' });
                expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(false);
            });
            it('hideItem method', function () {
                treeObj.hideItem({ id: '02' });
                expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].style.display).toBe('none');
            });
            it('showItem method', function () {
                treeObj.showItem({ id: '02' });
                expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].style.display).toBe('');
            });
            it('findItem method by ID', function () {
                var data = {
                    id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
                };
                expect(treeObj.findItem({ id: '03' })).toEqual(data);
            });
            it('findItem method by Text', function () {
                var data = {
                    id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
                };
                expect(treeObj.findItem({ text: 'text3' })).toEqual(data);
            });
            it('findItem method by Text and ID', function () {
                var data = {
                    id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
                };
                expect(treeObj.findItem({ id: '03', text: 'text3' })).toEqual(data);
            });
            it('findItem method by Text and ID', function () {
                var data = {
                    id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
                };
                expect(treeObj.findItem({ id: '02', text: 'text3' })).toEqual(undefined);
            });
            it('addItem method', function () {
                var newDS = [
                    { id: '04', text: 'item4' },
                    { id: '05', text: 'item5' }
                ];
                treeObj.addItem(newDS);
                expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(5);
            });
            it('addItem method when no sub child', function () {
                var newDS = [
                    { id: '04_1', text: 'item4_1' },
                    { id: '04_2', text: 'item4_2' }
                ];
                treeObj.addItem(newDS, { id: '04' });
                expect(treeObj.dataSource[3].child.length).toBe(2);
            });
            it('addItem method when no sub child', function () {
                var newDS = [
                    { id: '04_3', text: 'item4_3' },
                    { id: '04_4', text: 'item4_4' }
                ];
                treeObj.addItem(newDS, { id: '04' });
                expect(treeObj.dataSource[3].child.length).toBe(4);
            });
            it('hideItem method when no element has created', function () {
                treeObj.hideItem({ id: '04_4' });
                expect(treeObj.findItem({ id: '04_4' }).isVisible).toBe(false);
            });
            it('showItem method when no element has created', function () {
                treeObj.showItem({ id: '04_4' });
                expect(treeObj.findItem({ id: '04_4' }).isVisible).toBe(undefined);
            });
            it('hideItem method when not found', function () {
                treeObj.hideItem({ id: '06' });
                expect(treeObj.findItem({ id: '06' })).toBe(undefined);
            });
            it('showItem method when not found', function () {
                treeObj.showItem({ id: '06' });
                expect(treeObj.findItem({ id: '06' })).toBe(undefined);
            });
            it('disableItem method when no element has created ', function () {
                treeObj.disableItem({ id: '04_4' });
                expect(treeObj.findItem({ id: '04_4' }).enabled).toBe(false);
            });
            it('enableItem method when no element has created', function () {
                treeObj.enableItem({ id: '04_4' });
                expect(treeObj.findItem({ id: '04_4' }).hasOwnProperty('enabled')).toBe(false);
            });
            it('disableItem method when not found', function () {
                treeObj.disableItem({ id: '06' });
                expect(treeObj.findItem({ id: '06' })).toBe(undefined);
            });
            it('enableItem method when not found', function () {
                treeObj.enableItem({ id: '06' });
                expect(treeObj.findItem({ id: '06' })).toBe(undefined);
            });
            it('select item when no element has created', function () {
                var UL = treeObj.curUL;
                treeObj.selectItem({ id: '04_4' });
                expect(UL).toBe(treeObj.curUL);
            });
            it('select item when not found', function () {
                var UL = treeObj.curUL;
                treeObj.selectItem({ id: '06' });
                expect(UL).toBe(treeObj.curUL);
            });
            it('removeItem method by ID', function () {
                treeObj.removeItem({ id: '04' });
                expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(4);
            });
            it('removeItem method by Text', function () {
                treeObj.removeItem({ text: 'item5' });
                expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(3);
            });
            it('removeItem method with empty Object', function () {
                treeObj.removeItem({ id: '00' });
                expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(3);
            });
            it('destroy method', function () {
                treeObj.destroy();
                expect(ele.className).toBe('');
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('sub list navigation', function () {
            var treeObj;
            var ele = dom_1.createElement('div', { id: 'ListView' });
            beforeAll(function () {
                document.body.appendChild(ele);
                treeObj = new list_view_1.ListView({
                    dataSource: dataSource,
                    showHeader: true
                });
                treeObj.appendTo(ele);
            });
            describe('first level navigation', function () {
                var curUL;
                beforeEach(function (done) {
                    curUL = treeObj.curUL;
                    treeObj.selectItem({ id: '02' });
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(curUL).not.toBe(treeObj.curUL);
                    expect(dom_1.isVisible(curUL)).toBe(false);
                });
            });
            describe('back using swipe left works properly', function () {
                var curUL;
                beforeEach(function (done) {
                    var backButtonEle = dom_1.createElement('div', { className: 'e-back' });
                    var startMouseEventArs = {
                        clientX: 200, clientY: 200, target: treeObj.element, type: 'touchstart',
                        preventDefault: function () { }
                    };
                    var moveMouseEventArs = {
                        clientX: 250, clientY: 200, target: treeObj.element, type: 'touchmove',
                        preventDefault: function () { }
                    };
                    var endMouseEventArs = {
                        clientX: 300, clientY: 200, target: treeObj.element, type: 'touchend',
                        preventDefault: function () { }
                    };
                    curUL = treeObj.curUL;
                    treeObj.touchModule.startEvent(startMouseEventArs);
                    treeObj.touchModule.moveEvent(moveMouseEventArs);
                    treeObj.touchModule.endEvent(endMouseEventArs);
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(dom_1.isVisible(curUL)).toBe(false);
                });
                afterAll(function () {
                    treeObj.selectItem({ id: '02' });
                });
            });
            describe('back using swipe for invalid direction not navigate to parent', function () {
                var curUL;
                beforeEach(function (done) {
                    var backButtonEle = dom_1.createElement('div', { className: 'e-back' });
                    var startMouseEventArs = {
                        clientX: 200, clientY: 200, target: treeObj.element, type: 'touchstart',
                        preventDefault: function () { }
                    };
                    var moveMouseEventArs = {
                        clientX: 200, clientY: 500, target: treeObj.element, type: 'touchmove',
                        preventDefault: function () { }
                    };
                    var endMouseEventArs = {
                        clientX: 200, clientY: 500, target: treeObj.element, type: 'touchend',
                        preventDefault: function () { }
                    };
                    curUL = treeObj.curUL;
                    treeObj.touchModule.startEvent(startMouseEventArs);
                    treeObj.touchModule.moveEvent(moveMouseEventArs);
                    treeObj.touchModule.endEvent(endMouseEventArs);
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(dom_1.isVisible(curUL)).toBe(true);
                });
            });
            describe('second level navigation', function () {
                var curUL;
                beforeEach(function (done) {
                    curUL = treeObj.curUL;
                    treeObj.selectItem({ id: '02_1' });
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(curUL).not.toBe(treeObj.curUL);
                    expect(dom_1.isVisible(curUL)).toBe(false);
                    treeObj.back();
                });
                it('headerTitle on sub level', function () {
                    treeObj.headerTitle = 'Custom Title';
                    treeObj.dataBind();
                    expect(treeObj.element.querySelector('.e-headertext').innerHTML).not.toBe('Custom Title');
                });
            });
            describe('back navigation', function () {
                var curUL;
                beforeEach(function (done) {
                    curUL = treeObj.curUL;
                    treeObj.back();
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(curUL).not.toBe(treeObj.curUL);
                    expect(dom_1.isVisible(curUL)).toBe(false);
                });
            });
            describe('las back navigation', function () {
                var curUL;
                beforeEach(function (done) {
                    curUL = treeObj.curUL;
                    treeObj.back();
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(curUL).not.toBe(treeObj.curUL);
                    expect(dom_1.isVisible(curUL)).toBe(false);
                });
            });
            describe('back navigation when no more back navigation', function () {
                var curUL;
                beforeEach(function () {
                    curUL = treeObj.curUL;
                    treeObj.back();
                });
                it('', function () {
                    expect(curUL).toBe(treeObj.curUL);
                });
            });
            describe('navigate to already visited child', function () {
                var curUL;
                beforeEach(function (done) {
                    curUL = treeObj.curUL;
                    treeObj.selectItem({ id: '01' });
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(curUL).not.toBe(treeObj.curUL);
                    expect(dom_1.isVisible(curUL)).toBe(false);
                });
            });
            describe('back navigation sortOrder change', function () {
                var curUL;
                beforeEach(function (done) {
                    treeObj.sortOrder = 'Descending';
                    treeObj.dataBind();
                    curUL = treeObj.curUL;
                    treeObj.back();
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(curUL).not.toBe(treeObj.curUL);
                    expect(dom_1.isVisible(curUL)).toBe(false);
                });
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('key actions', function () {
            var keyEventArgs = {
                preventDefault: function () { },
                action: 'select'
            };
            var treeObj;
            var ele = dom_1.createElement('div', { id: 'ListView' });
            beforeAll(function () {
                document.body.appendChild(ele);
                treeObj = new list_view_1.ListView({
                    dataSource: dataSource
                });
                treeObj.appendTo(ele);
            });
            it('select action', function () {
                var ele = treeObj.element;
                var li = ele.querySelectorAll('li');
                treeObj.setSelectLI(li[1]);
                expect(li[1].classList.contains('e-active')).toBe(true);
                treeObj.keyActionHandler(keyEventArgs);
                expect(li[1].classList.contains('e-active')).toBe(true);
            });
            it('select action', function () {
                var ele = treeObj.element;
                var ul = treeObj.curUL;
                var li = ul.querySelectorAll('li');
                treeObj.setHoverLI(li[2]);
                expect(li[2].classList.contains('e-active')).toBe(false);
                treeObj.keyActionHandler(keyEventArgs);
                expect(li[2].classList.contains('e-active')).toBe(true);
            });
            it('hoverup action', function () {
                keyEventArgs.action = 'moveUp';
                var ele = treeObj.element;
                var li = treeObj.curUL.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(false);
                treeObj.keyActionHandler(keyEventArgs);
                treeObj.keyActionHandler(keyEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(true);
            });
            it('hoverdown action', function () {
                keyEventArgs.action = 'moveDown';
                var ele = treeObj.element;
                var ul = treeObj.curUL;
                var li = ul.querySelectorAll('li');
                expect(li[1].classList.contains('e-hover')).toBe(false);
                treeObj.keyActionHandler(keyEventArgs);
                expect(li[1].classList.contains('e-hover')).toBe(true);
            });
            it('back action', function () {
                keyEventArgs.action = 'back';
                var ul = treeObj.curUL;
                treeObj.keyActionHandler(keyEventArgs);
                expect(treeObj.curUL).not.toBe(ul);
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('actionComplete after control destroyed', function () {
            var actionCompleteFunction = jasmine.createSpy('actionComplete');
            var ele = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            var nTree;
            beforeAll(function () {
                document.body.appendChild(ele);
                nTree = new list_view_1.ListView({
                    dataSource: new ej2_data_1.DataManager({
                        url: '/api/Employees',
                        adaptor: new ej2_data_1.ODataV4Adaptor
                    }),
                    actionComplete: actionCompleteFunction,
                    fields: { id: 'EmployeeID', text: 'FirstName' }
                });
                nTree.appendTo('#newTree');
                nTree.destroy();
            });
            it('actionComplete event after control destroyed', function () {
                expect(actionCompleteFunction).not.toHaveBeenCalled();
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('actionFailure after control destroyed', function () {
            var actionFailedFunction = jasmine.createSpy('actionFailure');
            var ele = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            var nTree;
            beforeAll(function () {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                nTree = new list_view_1.ListView({
                    dataSource: new ej2_data_1.DataManager({
                        url: '/test/db',
                        adaptor: new ej2_data_1.ODataV4Adaptor
                    }),
                    fields: { id: 'EmployeeID', text: 'FirstName' },
                    actionFailure: actionFailedFunction
                });
                nTree.appendTo('#newTree');
                nTree.destroy();
            });
            beforeEach(function () {
                var request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 404,
                    'contentType': 'application/json',
                    'responseText': 'Page not found'
                });
            });
            it('actionFailure after destroyed', function () {
                expect(actionFailedFunction).not.toHaveBeenCalled();
            });
            afterAll(function () {
                ele.remove();
                jasmine.Ajax.uninstall();
            });
        });
        describe('mouse events', function () {
            var mouseEventArgs = {
                preventDefault: function () { },
                target: null
            };
            var treeObj;
            var ele = dom_1.createElement('div', { id: 'ListView' });
            beforeAll(function () {
                document.body.appendChild(ele);
                treeObj = new list_view_1.ListView({ dataSource: dataSource });
                treeObj.appendTo(ele);
            });
            it('mouse click event', function () {
                var li = treeObj.curUL.querySelectorAll('li');
                mouseEventArgs.target = li[2].firstChild;
                expect(li[2].classList.contains('e-active')).toBe(false);
                treeObj.clickHandler(mouseEventArgs);
                expect(li[2].classList.contains('e-active')).toBe(true);
            });
            it('mouse click event', function () {
                var li = treeObj.curUL.querySelectorAll('li');
                mouseEventArgs.target = li[0];
                expect(li[0].classList.contains('e-active')).toBe(false);
                treeObj.clickHandler(mouseEventArgs);
                expect(li[0].classList.contains('e-active')).toBe(true);
            });
            it('mouse hover event', function () {
                var li = treeObj.curUL.querySelectorAll('li');
                mouseEventArgs.target = li[0].firstChild;
                expect(li[0].classList.contains('e-hover')).toBe(false);
                treeObj.hoverHandler(mouseEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(true);
            });
            it('mouse leave event', function () {
                var li = treeObj.curUL.querySelectorAll('li');
                mouseEventArgs.target = li[0].firstChild;
                expect(li[0].classList.contains('e-hover')).toBe(true);
                treeObj.leaveHandler(mouseEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(false);
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('animation', function () {
            var treeObj;
            var ele = dom_1.createElement('div', { id: 'ListView' });
            beforeAll(function () {
                document.body.appendChild(ele);
                treeObj = new list_view_1.ListView({ dataSource: dataSource });
                treeObj.appendTo(ele);
            });
            describe('switch view', function () {
                var mouseEventArgs = {
                    preventDefault: function () { },
                    target: null
                };
                var curUL;
                beforeEach(function (done) {
                    curUL = treeObj.curUL;
                    mouseEventArgs.target = curUL.querySelectorAll('li')[0];
                    treeObj.clickHandler(mouseEventArgs);
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(curUL).not.toBe(treeObj.curUL);
                    expect(dom_1.isVisible(curUL)).toBe(false);
                });
            });
            describe('mouse click on back button', function () {
                var mouseEventArgs = {
                    preventDefault: function () { },
                    target: null
                };
                var curUL;
                beforeEach(function (done) {
                    var backButtonEle = dom_1.createElement('div', { className: 'e-icon-back' });
                    mouseEventArgs.target = backButtonEle;
                    curUL = treeObj.curUL;
                    treeObj.clickHandler(mouseEventArgs);
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(dom_1.isVisible(curUL)).toBe(false);
                });
                afterEach(function (done) {
                    mouseEventArgs.target = treeObj.curUL.querySelectorAll('li')[0];
                    treeObj.clickHandler(mouseEventArgs);
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
            });
            describe('back on header text click', function () {
                var mouseEventArgs = {
                    preventDefault: function () { },
                    target: null
                };
                var curUL;
                beforeEach(function (done) {
                    var backheaderEle = dom_1.createElement('div', { className: 'e-headertext' });
                    mouseEventArgs.target = backheaderEle;
                    curUL = treeObj.curUL;
                    treeObj.clickHandler(mouseEventArgs);
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(dom_1.isVisible(curUL)).toBe(false);
                });
            });
            describe('no animation 0ms', function () {
                var curUL;
                beforeEach(function (done) {
                    curUL = treeObj.curUL;
                    treeObj.animation.effect = 'None';
                    treeObj.dataBind();
                    treeObj.selectItem({ id: '01' });
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(dom_1.isVisible(curUL)).toBe(false);
                });
            });
            it('switchView method when no element', function () {
                var cUL = treeObj.curUL;
                expect(treeObj.switchView()).toBe(undefined);
                expect(cUL).toBe(treeObj.curUL);
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('property change', function () {
            var treeObj;
            var ele = dom_1.createElement('div', { id: 'ListView' });
            beforeAll(function () {
                document.body.appendChild(ele);
                treeObj = new list_view_1.ListView({ dataSource: dataSource });
                treeObj.appendTo(ele);
            });
            it('onproperty change function call', function () {
                spyOn(treeObj, 'onPropertyChanged');
                expect(treeObj.onPropertyChanged).not.toHaveBeenCalled();
                treeObj.animation = { effect: 'SlideDown' };
                treeObj.dataBind();
                expect(treeObj.onPropertyChanged).toHaveBeenCalled();
            });
            it('enable property to be false', function () {
                expect(treeObj.element.classList.contains('e-disabled')).toBe(false);
                treeObj.enable = false;
                treeObj.dataBind();
                expect(treeObj.element.classList.contains('e-disabled')).toBe(true);
            });
            it('enable property to be true', function () {
                expect(treeObj.element.classList.contains('e-disabled')).toBe(true);
                treeObj.enable = true;
                treeObj.dataBind();
                expect(treeObj.element.classList.contains('e-disabled')).toBe(false);
            });
            it('cssClass property to set as css-classname', function () {
                expect(treeObj.element.classList.contains('css-classname')).toBe(false);
                treeObj.cssClass = 'css-classname';
                treeObj.dataBind();
                expect(treeObj.element.classList.contains('css-classname')).toBe(true);
            });
            it('cssClass property to set as css-newclassname', function () {
                expect(treeObj.element.classList.contains('css-newclassname')).toBe(false);
                expect(treeObj.element.classList.contains('css-classname')).toBe(true);
                treeObj.cssClass = 'css-newclassname';
                treeObj.dataBind();
                expect(treeObj.element.classList.contains('css-classname')).toBe(false);
                expect(treeObj.element.classList.contains('css-newclassname')).toBe(true);
            });
            it('htmlAttributes property', function () {
                expect(treeObj.element.getAttribute('title')).toBe(null);
                treeObj.htmlAttributes = { title: 'ListView' };
                treeObj.dataBind();
                expect(treeObj.element.getAttribute('title')).toBe('ListView');
            });
            it('height property', function () {
                expect(treeObj.element.style.height).toBe('');
                treeObj.height = '200px';
                treeObj.dataBind();
                expect(treeObj.element.style.height).toBe('200px');
            });
            it('height property in number', function () {
                treeObj.height = 300;
                treeObj.dataBind();
                expect(treeObj.element.style.height).toBe('300px');
            });
            it('width property', function () {
                expect(treeObj.element.style.width).toBe('');
                treeObj.width = '200px';
                treeObj.dataBind();
                expect(treeObj.element.style.width).toBe('200px');
            });
            it('width property in number', function () {
                treeObj.width = 300;
                treeObj.dataBind();
                expect(treeObj.element.style.width).toBe('300px');
            });
            it('enable RTL property', function () {
                treeObj.enableRtl = true;
                treeObj.dataBind();
                expect(treeObj.element.classList.contains('e-rtl')).toBe(true);
            });
            it('enable RTL property', function () {
                treeObj.enableRtl = false;
                treeObj.dataBind();
                expect(treeObj.element.classList.contains('e-rtl')).toBe(false);
            });
            it('dataSource property', function () {
                treeObj.dataSource = [{ id: '01', text: 'First One', subText: '1st' }, { id: '02', text: 'Second One', subText: '2nd' }];
                treeObj.dataBind();
                expect(treeObj.curUL.querySelectorAll('li').length).toBe(2);
            });
            it('fields property', function () {
                expect(treeObj.curUL.querySelector('.e-list-text').innerHTML).toBe('First One');
                treeObj.fields = { text: 'subText', id: 'id' };
                treeObj.dataBind();
                expect(treeObj.curUL.querySelector('.e-list-text').innerHTML).toBe('1st');
            });
            it('sortOrder property', function () {
                expect(treeObj.curUL.querySelector('.e-list-text').innerHTML).toBe('1st');
                treeObj.sortOrder = 'Descending';
                treeObj.dataBind();
                expect(treeObj.curUL.querySelector('.e-list-text').innerHTML).toBe('2nd');
            });
            it('headerTitle property', function () {
                treeObj.headerTitle = 'Custom Title';
                treeObj.showHeader = true;
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-headertext').innerHTML).toBe('Custom Title');
            });
            it('showHeader property', function () {
                treeObj.showHeader = false;
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-header').style.display).toBe('none');
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('grouping list', function () {
            var treeObj;
            var ele = dom_1.createElement('div', { id: 'ListView' });
            beforeAll(function () {
                document.body.appendChild(ele);
                treeObj = new list_view_1.ListView({ dataSource: dataSource, fields: { id: 'id', text: 'text', groupBy: 'category' } });
                treeObj.appendTo(ele);
            });
            it('element grouped', function () {
                expect(treeObj.element.querySelectorAll('li').length).toBe(5);
            });
            describe('sub child navigation on grouped list', function () {
                var curUL;
                beforeEach(function (done) {
                    curUL = treeObj.curUL;
                    treeObj.selectItem({ id: '01' });
                    treeObj.actionComplete = function () {
                        done();
                    };
                });
                it('', function () {
                    expect(curUL).not.toBe(treeObj.curUL);
                    expect(dom_1.isVisible(curUL)).toBe(false);
                });
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('sorting list', function () {
            var treeObj;
            var ele = dom_1.createElement('div', { id: 'ListView' });
            beforeAll(function () {
                document.body.appendChild(ele);
                treeObj = new list_view_1.ListView({ dataSource: dataSource, sortOrder: 'Descending' });
                treeObj.appendTo(ele);
            });
            it('sorting in desending order', function () {
                expect(treeObj.element.querySelectorAll('li').length).toBe(3);
                expect(treeObj.liCollection[0].querySelector('.e-list-text').innerHTML).toBe('text3');
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('events', function () {
            var treeObj;
            var ele = dom_1.createElement('div', { id: 'ListView' });
            var mouseEventArgs = {
                preventDefault: function () { },
                target: null
            };
            beforeAll(function () {
                document.body.appendChild(ele);
                treeObj = new list_view_1.ListView({ dataSource: dataSource });
                treeObj.appendTo(ele);
            });
            it('select event call', function () {
                var selectFn = jasmine.createSpy('selectFun');
                treeObj.select = selectFn;
                treeObj.selectItem({ id: '03' });
                expect(selectFn).toHaveBeenCalledWith({
                    name: 'select',
                    item: treeObj.liCollection[2], text: 'text3',
                    data: { id: '03', text: 'text3', icon: 'iconClass3', category: 'a' }
                });
            });
            it('actionComplete event call', function () {
                var actionComplete = jasmine.createSpy('complete');
                treeObj.actionComplete = actionComplete;
                treeObj.dataSource = [{ id: '01', text: '01' }];
                treeObj.dataBind();
                expect(actionComplete).toHaveBeenCalled();
            });
            describe('actionFailure event', function () {
                var actionFailedFunction = jasmine.createSpy('actionFailure');
                var ele = document.createElement('div');
                ele.appendChild(document.createElement('ul'));
                ele.id = 'newTree';
                var nTree;
                beforeAll(function () {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    nTree = new list_view_1.ListView({
                        dataSource: new ej2_data_1.DataManager({
                            url: '/test/db',
                            adaptor: new ej2_data_1.ODataV4Adaptor
                        }),
                        fields: { id: 'EmployeeID', text: 'FirstName' },
                        actionFailure: actionFailedFunction
                    });
                    nTree.appendTo('#newTree');
                });
                beforeEach(function (done) {
                    var request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith({
                        'status': 404,
                        'contentType': 'application/json',
                        'responseText': 'Page not found'
                    });
                    setTimeout(function () { done(); }, 100);
                });
                it('initialized HTML data', function () {
                    expect(actionFailedFunction).toHaveBeenCalled();
                });
                afterAll(function () {
                    ele.remove();
                    jasmine.Ajax.uninstall();
                });
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('enable persistance', function () {
            var treeObj;
            var ele = dom_1.createElement('div', { id: 'ListView' });
            beforeEach(function () {
                document.body.appendChild(ele);
                treeObj = new list_view_1.ListView({ dataSource: dataSource, fields: { text: 'id' }, enablePersistence: true, cssClass: 'testclass' });
                treeObj.appendTo(ele);
            });
            it('property localStorage updated test', function () {
                treeObj.destroy();
                expect(JSON.parse(window.localStorage.getItem('listviewListView')).cssClass).toBe('testclass');
                ele.remove();
            });
            it('rendering from persistance property', function () {
                expect(treeObj.element.classList.contains('testclass')).toBe(true);
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('Create ListView using builder', function () {
            var treeObj;
            var ele;
            beforeEach(function () {
                ele = dom_1.createElement('div', { id: 'ListView' });
                treeObj = new list_view_1.listViewBuilder(ele).dataSource(dataSource).headerTitle('test').create();
            });
            it('default initialize', function () {
                expect(ele.childNodes.length).not.toBe(0);
            });
            it('class name', function () {
                expect(ele.classList.contains('e-listview')).toBe(true);
            });
            it('dataSource Binding', function () {
                expect(treeObj.dataSource).toEqual(dataSource);
            });
            afterEach(function () {
                ele.remove();
            });
        });
    });
});
