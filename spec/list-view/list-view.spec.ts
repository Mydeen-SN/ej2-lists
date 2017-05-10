/**
 * ListView spec document
 */
import { createElement, isVisible } from '@syncfusion/ej2-base/dom';
import { ListView, ListViewEffect, listViewBuilder } from '../../src/list-view/list-view';
import { SortOrder } from '../../src/common/list-base';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import '../../node_modules/es6-promise/dist/es6-promise';
interface CommonArgs {
    changedTouches?: any[];
    clientX?: number;
    clientY?: number;
    target?: Element | HTMLElement;
    type?: string;
    preventDefault(): void;
}

let dataSource: { [key: string]: Object }[] = [
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

describe('ListView', () => {

    describe('Local Data Binding', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: dataSource });
            treeObj.appendTo(ele);
        });

        it('default initialize', () => {
            expect(ele.childNodes.length).not.toBe(0);
        });

        it('class name', () => {
            expect(ele.classList.contains('e-listview')).toBe(true);
        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('HTMLData Data Binding', () => {

        let ele: HTMLElement = document.createElement('div');
        ele.appendChild(document.createElement('ul'));
        ele.id = 'newTree';
        ele.querySelector('ul').innerHTML =
            '<li id="i1">item1<ul><li id="s1">sub1</li><li id="s2">sub2</li><li id="s3">sub3</li></ul></li>' +
            '<li id="i2" style="display:none">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
            '<li>item6</li><li>item7</li>';
        let nTree: ListView;
        beforeAll(() => {
            document.body.appendChild(ele);
            nTree = new ListView();
            nTree.appendTo('#newTree');
        });

        it('initialized HTML data', () => {
            expect(ele.querySelectorAll('.e-list-item').length).toBe(7);
            expect((nTree.dataSource as { [key: string]: Object }[]).length).not.toBe(0);
        });

        it('getSubDS', () => {
            expect((<any>nTree).getSubDS()).toBe(nTree.dataSource);
        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('HTMLData Without UL and LI', () => {
        let ele: HTMLElement = document.createElement('div');
        ele.id = 'newTree';
        let nTree: ListView;
        beforeAll(() => {
            document.body.appendChild(ele);
            nTree = new ListView();
            nTree.appendTo('#newTree');
        });
        it('initialized HTML data', () => {
            expect(ele.querySelectorAll('.e-list-item').length).toBe(0);
        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('Remote Data Binding', () => {
        describe('default query', () => {
            let ele: HTMLElement = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            let nTree: ListView;
            beforeAll((done: Function) => {
                document.body.appendChild(ele);
                nTree = new ListView({
                    dataSource: new DataManager({
                        url: '/api/Employees',
                        adaptor: new ODataV4Adaptor
                    }),
                    fields: { id: 'EmployeeID', text: 'FirstName' },
                    actionComplete: () => {
                        done();
                    }
                });
                nTree.appendTo('#newTree');
            });

            it('initialized HTML data', () => {
                expect(ele.querySelectorAll('.e-list-item').length).toBe(9);
            });

            afterAll(() => {
                ele.remove();
            });
        });

        describe('custom table name fields', () => {

            let ele: HTMLElement = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            let nTree: ListView;
            beforeAll((done: Function) => {
                document.body.appendChild(ele);
                nTree = new ListView({
                    dataSource: new DataManager({
                        url: '/api',
                        adaptor: new ODataV4Adaptor
                    }),
                    fields: { id: 'EmployeeID', text: 'FirstName', tableName: 'Employees' },
                    actionComplete: () => {
                        done();
                    }
                });
                nTree.appendTo('#newTree');
            });
            it('initialized HTML data', () => {
                expect(ele.querySelectorAll('.e-list-item').length).toBe(9);
            });

            afterAll(() => {
                ele.remove();
            });
        });

        describe('custom query name fields', () => {

            let ele: HTMLElement = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            let nTree: ListView;
            beforeAll((done: Function) => {
                document.body.appendChild(ele);
                nTree = new ListView({
                    dataSource: new DataManager({
                        url: '/api',
                        adaptor: new ODataV4Adaptor
                    }),
                    query: new Query().from('Employees').select(['EmployeeID', 'FirstName']).take(5),
                    fields: { id: 'EmployeeID', text: 'FirstName' },
                    actionComplete: () => {
                        done();
                    }
                });
                nTree.appendTo('#newTree');
            });

            it('initialized HTML data', () => {
                expect(ele.querySelectorAll('.e-list-item').length).toBe(5);
            });

            afterAll(() => {
                ele.remove();
            });
        });
    });

    describe('methods', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({
                dataSource: dataSource
            });
            treeObj.appendTo(ele);
        });

        it('get module name', () => {
            expect(treeObj.getModuleName()).toBe('listview');
        });

        it('hover previous sibling li when nothing is selected', () => {
            let ele: Element = treeObj.element;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            expect(li[2].classList.contains('e-hover')).toBe(false);
            treeObj.hoverSiblingLI(true);
            expect(li[2].classList.contains('e-hover')).toBe(true);
        });

        it('hover next sibling li when nothing is selected', () => {
            let ele: Element = treeObj.element;
            let li: Element[] & NodeListOf<HTMLLIElement> = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            treeObj.removeHover();
            expect(li[0].classList.contains('e-hover')).toBe(false);
            treeObj.hoverSiblingLI();
            expect(li[0].classList.contains('e-hover')).toBe(true);
            treeObj.removeHover();
        });

        it('set hover li', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect(li.classList.contains('e-hover')).toBe(false);
            treeObj.setHoverLI(li);
            expect(li.classList.contains('e-hover')).toBe(true);
        });

        it('set hover next sibling LI', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelectorAll('li')[1];
            expect(li.classList.contains('e-hover')).toBe(false);
            treeObj.hoverSiblingLI();
            expect(li.classList.contains('e-hover')).toBe(true);
        });

        it('set hover previous sibling LI', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect(li.classList.contains('e-hover')).toBe(false);
            treeObj.hoverSiblingLI(true);
            expect(li.classList.contains('e-hover')).toBe(true);
        });

        it('set hover li without element', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect(li.classList.contains('e-hover')).toBe(true);
            treeObj.setHoverLI();
            expect(li.classList.contains('e-hover')).toBe(true);
        });

        it('remove hover', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect(li.classList.contains('e-hover')).toBe(true);
            treeObj.removeHover();
            expect(li.classList.contains('e-hover')).toBe(false);
        });

        it('remove hover when no hovered element', () => {
            let ele: Element = treeObj.element;
            let li: NodeList = ele.querySelectorAll('.e-hover');
            expect(li.length).toBe(0);
            treeObj.removeHover();
            li = ele.querySelectorAll('.e-hover');
            expect(li.length).toBe(0);
        });

        it('remove select', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            treeObj.removeSelect();
            expect(li.classList.contains('e-hover')).toBe(false);
        });

        it('select item', (done: Function) => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect((li as Element).classList.contains('e-active')).toBe(false);
            treeObj.actionComplete = () => {
                done();
            }
            treeObj.selectItem(li);
            expect((li as Element).classList.contains('e-active')).toBe(true);
        });

        it('set hover li when it already selected', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect((li as Element).classList.contains('e-hover')).toBe(false);
            treeObj.setHoverLI(li);
            expect((li as Element).classList.contains('e-hover')).toBe(false);
        });

        it('set select li allready selected li', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect((li as Element).classList.contains('e-active')).toBe(true);
            treeObj.setSelectLI(li);
            expect((li as Element).classList.contains('e-active')).toBe(true);
        });

        it('getSelectedItem method', () => {
            let li: Element = ele.querySelector('li');

            let data: any = {
                item: li, text: 'text1', data:
                {
                    id: '01', text: 'text1', icon: 'iconClass1', category: 'a', child: [
                        { id: '01_1', text: 'subText1', icon: 'iconSubClass1', category: 'a' },
                        { id: '01_2', text: 'subText2', icon: 'iconSubClass2', category: 'b' },
                        { id: '01_3', text: 'subText3', icon: 'iconSubClass3', category: 'a' }]
                }
            };

            expect(treeObj.getSelectedItem()).toEqual(data);
        });

        describe('back', () => {
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                target: null
            };
            let curUL: Element;
            beforeEach((done: Function) => {
                let backButtonEle: Element = createElement('div', { className: 'e-back' });
                mouseEventArgs.target = backButtonEle;
                curUL = treeObj.curUL;
                treeObj.back();
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('mouse click on back button', () => {
                expect(isVisible(curUL)).toBe(false);
            });
        });

        it('disableItem method', () => {
            treeObj.disableItem({ id: '02' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(true);
        });

        it('disableItem when allready disabled', () => {
            treeObj.disableItem({ id: '02' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(true);
        });

        it('enableItem method', () => {
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(true);
            treeObj.enableItem({ id: '02' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(false);
        });

        it('enableItem when already enabled method', () => {
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(false);
            treeObj.enableItem({ id: '02' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(false);
        });

        it('hideItem method', () => {
            treeObj.hideItem({ id: '02' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].style.display).toBe('none');
        });

        it('showItem method', () => {
            treeObj.showItem({ id: '02' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].style.display).toBe('');
        });

        it('findItem method by ID', () => {
            let data: any = {
                id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
            };
            expect(treeObj.findItem({ id: '03' })).toEqual(data);
        });

        it('findItem method by Text', () => {
            let data: any = {
                id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
            };
            expect(treeObj.findItem({ text: 'text3' })).toEqual(data);
        });

        it('findItem method by Text and ID', () => {
            let data: any = {
                id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
            };
            expect(treeObj.findItem({ id: '03', text: 'text3' })).toEqual(data);
        });

        it('findItem method by Text and ID', () => {
            let data: any = {
                id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
            };
            expect(treeObj.findItem({ id: '02', text: 'text3' })).toEqual(undefined);
        });

        it('addItem method', () => {
            let newDS: any = [
                { id: '04', text: 'item4' },
                { id: '05', text: 'item5' }
            ];
            treeObj.addItem(newDS);
            expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(5);
        });

        it('addItem method when no sub child', () => {
            let newDS: any = [
                { id: '04_1', text: 'item4_1' },
                { id: '04_2', text: 'item4_2' }
            ];
            treeObj.addItem(newDS, { id: '04' });
            expect(treeObj.dataSource[3].child.length).toBe(2);
        });

        it('addItem method when no sub child', () => {
            let newDS: any = [
                { id: '04_3', text: 'item4_3' },
                { id: '04_4', text: 'item4_4' }
            ];
            treeObj.addItem(newDS, { id: '04' });
            expect(treeObj.dataSource[3].child.length).toBe(4);
        });

        it('hideItem method when no element has created', () => {
            treeObj.hideItem({ id: '04_4' });
            expect(treeObj.findItem({ id: '04_4' }).isVisible).toBe(false);
        });

        it('showItem method when no element has created', () => {
            treeObj.showItem({ id: '04_4' });
            expect(treeObj.findItem({ id: '04_4' }).isVisible).toBe(undefined);
        });

        it('hideItem method when not found', () => {
            treeObj.hideItem({ id: '06' });
            expect(treeObj.findItem({ id: '06' })).toBe(undefined);
        });

        it('showItem method when not found', () => {
            treeObj.showItem({ id: '06' });
            expect(treeObj.findItem({ id: '06' })).toBe(undefined);
        });

        it('disableItem method when no element has created ', () => {
            treeObj.disableItem({ id: '04_4' });
            expect(treeObj.findItem({ id: '04_4' }).enabled).toBe(false);
        });

        it('enableItem method when no element has created', () => {
            treeObj.enableItem({ id: '04_4' });
            expect(treeObj.findItem({ id: '04_4' }).hasOwnProperty('enabled')).toBe(false);
        });

        it('disableItem method when not found', () => {
            treeObj.disableItem({ id: '06' });
            expect(treeObj.findItem({ id: '06' })).toBe(undefined);
        });

        it('enableItem method when not found', () => {
            treeObj.enableItem({ id: '06' });
            expect(treeObj.findItem({ id: '06' })).toBe(undefined);
        });

        it('select item when no element has created', () => {
            let UL: any = treeObj.curUL;
            treeObj.selectItem({ id: '04_4' });
            expect(UL).toBe(treeObj.curUL);
        });

        it('select item when not found', () => {
            let UL: any = treeObj.curUL;
            treeObj.selectItem({ id: '06' });
            expect(UL).toBe(treeObj.curUL);
        });

        it('removeItem method by ID', () => {
            treeObj.removeItem({ id: '04' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(4);
        });

        it('removeItem method by Text', () => {
            treeObj.removeItem({ text: 'item5' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(3);
        });

        it('removeItem method with empty Object', () => {
            treeObj.removeItem({ id: '00' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(3);
        });

        it('destroy method', () => {
            treeObj.destroy();
            expect(ele.className).toBe('');

        });

        afterAll(() => {
            ele.remove();
        });

    });

    describe('sub list navigation', () => {

        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({
                dataSource: dataSource,
                showHeader: true
            });
            treeObj.appendTo(ele);
        });

        describe('first level navigation', () => {
            let curUL: any;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.selectItem({ id: '02' });
                treeObj.actionComplete = () => {
                    done();
                }
            });

            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });
        describe('back using swipe left works properly', () => {
            let curUL: Element;
            beforeEach((done: Function) => {
                let backButtonEle: Element = createElement('div', { className: 'e-back' });
                let startMouseEventArs: CommonArgs = {
                    clientX: 200, clientY: 200, target: treeObj.element, type: 'touchstart',
                    preventDefault: (): void => { /** Do Nothing */ }
                };

                let moveMouseEventArs: CommonArgs = {
                    clientX: 250, clientY: 200, target: treeObj.element, type: 'touchmove',
                    preventDefault: (): void => { /** Do Nothing */ }
                };

                let endMouseEventArs: CommonArgs = {
                    clientX: 300, clientY: 200, target: treeObj.element, type: 'touchend',
                    preventDefault: (): void => { /** Do Nothing */ }
                };
                curUL = treeObj.curUL;
                //Actions
                treeObj.touchModule.startEvent(startMouseEventArs);
                treeObj.touchModule.moveEvent(moveMouseEventArs);
                treeObj.touchModule.endEvent(endMouseEventArs);
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(isVisible(curUL)).toBe(false);
            });
            afterAll(() => {
                treeObj.selectItem({ id: '02' });
            });
        });
        describe('back using swipe for invalid direction not navigate to parent', () => {
            let curUL: Element;
            beforeEach((done: Function) => {
                let backButtonEle: Element = createElement('div', { className: 'e-back' });
                let startMouseEventArs: CommonArgs = {
                    clientX: 200, clientY: 200, target: treeObj.element, type: 'touchstart',
                    preventDefault: (): void => { /** Do Nothing */ }
                };

                let moveMouseEventArs: CommonArgs = {
                    clientX: 200, clientY: 500, target: treeObj.element, type: 'touchmove',
                    preventDefault: (): void => { /** Do Nothing */ }
                };

                let endMouseEventArs: CommonArgs = {
                    clientX: 200, clientY: 500, target: treeObj.element, type: 'touchend',
                    preventDefault: (): void => { /** Do Nothing */ }
                };
                curUL = treeObj.curUL;
                //Actions
                treeObj.touchModule.startEvent(startMouseEventArs);
                treeObj.touchModule.moveEvent(moveMouseEventArs);
                treeObj.touchModule.endEvent(endMouseEventArs);
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(isVisible(curUL)).toBe(true);
            });
        });
        describe('second level navigation', () => {
            let curUL: any;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.selectItem({ id: '02_1' });
                treeObj.actionComplete = () => {
                    done();
                }
            });

            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
                treeObj.back();
            });

            it('headerTitle on sub level', () => {
                treeObj.headerTitle = 'Custom Title';
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-headertext').innerHTML).not.toBe('Custom Title');
            });

        });

        describe('back navigation', () => {
            let curUL: any;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.back();
                treeObj.actionComplete = () => {
                    done();
                }
            });

            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });

        describe('las back navigation', () => {
            let curUL: any;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.back();
                treeObj.actionComplete = () => {
                    done();
                }
            });

            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });

        describe('back navigation when no more back navigation', () => {
            let curUL: any;
            beforeEach(() => {
                curUL = treeObj.curUL;
                treeObj.back();
            });

            it('', () => {
                expect(curUL).toBe(treeObj.curUL);
            });
        });

        describe('navigate to already visited child', () => {
            let curUL: any;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.selectItem({ id: '01' });
                treeObj.actionComplete = () => {
                    done();
                }
            });

            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });

        describe('back navigation sortOrder change', () => {
            let curUL: any;
            beforeEach((done: Function) => {
                treeObj.sortOrder = 'Descending';
                treeObj.dataBind();
                curUL = treeObj.curUL;
                treeObj.back();
                treeObj.actionComplete = () => {
                    done();
                }
            });

            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });

        afterAll(() => {
            ele.remove();
        });

    });

    describe('key actions', () => {
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'select'
        };
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({
                dataSource: dataSource
            });
            treeObj.appendTo(ele);
        });

        it('select action', () => {
            let ele: Element = treeObj.element;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ele.querySelectorAll('li');
            treeObj.setSelectLI(li[1]);
            expect((li[1] as Element).classList.contains('e-active')).toBe(true);
            treeObj.keyActionHandler(keyEventArgs);
            expect((li[1] as Element).classList.contains('e-active')).toBe(true);
        });

        it('select action', () => {
            let ele: Element = treeObj.element;
            let ul: Element = treeObj.curUL;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            treeObj.setHoverLI(li[2]);
            expect((li[2] as Element).classList.contains('e-active')).toBe(false);
            treeObj.keyActionHandler(keyEventArgs);
            expect((li[2] as Element).classList.contains('e-active')).toBe(true);
        });

        it('hoverup action', () => {
            keyEventArgs.action = 'moveUp';
            let ele: Element = treeObj.element;
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.curUL.querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
            treeObj.keyActionHandler(keyEventArgs);
            treeObj.keyActionHandler(keyEventArgs);
            expect((li[0] as Element).classList.contains('e-hover')).toBe(true);
        });

        it('hoverdown action', () => {
            keyEventArgs.action = 'moveDown';
            let ele: Element = treeObj.element;
            let ul: Element = treeObj.curUL;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            expect((li[1] as Element).classList.contains('e-hover')).toBe(false);
            treeObj.keyActionHandler(keyEventArgs);
            expect((li[1] as Element).classList.contains('e-hover')).toBe(true);
        });

        it('back action', () => {
            keyEventArgs.action = 'back';
            let ul: Element = treeObj.curUL;
            treeObj.keyActionHandler(keyEventArgs);
            expect(treeObj.curUL).not.toBe(ul);
        });

        afterAll(() => {
            ele.remove();
        });

    });

    describe('actionComplete after control destroyed', () => {
        let actionCompleteFunction: any = jasmine.createSpy('actionComplete');
        let ele: HTMLElement = document.createElement('div');
        ele.appendChild(document.createElement('ul'));
        ele.id = 'newTree';
        let nTree: ListView;
        beforeAll(() => {
            document.body.appendChild(ele);
            nTree = new ListView({
                dataSource: new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataV4Adaptor
                }),
                actionComplete: actionCompleteFunction,
                fields: { id: 'EmployeeID', text: 'FirstName' }
            });
            nTree.appendTo('#newTree');
            nTree.destroy();
        });
        it('actionComplete event after control destroyed', () => {
            expect(actionCompleteFunction).not.toHaveBeenCalled();
        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('actionFailure after control destroyed', () => {
        let actionFailedFunction: any = jasmine.createSpy('actionFailure');
        let ele: HTMLElement = document.createElement('div');
        ele.appendChild(document.createElement('ul'));
        ele.id = 'newTree';
        let nTree: ListView;
        beforeAll(() => {
            jasmine.Ajax.install();
            document.body.appendChild(ele);
            nTree = new ListView({
                dataSource: new DataManager({
                    url: '/test/db',
                    adaptor: new ODataV4Adaptor
                }),
                fields: { id: 'EmployeeID', text: 'FirstName' },
                actionFailure: actionFailedFunction
            });
            nTree.appendTo('#newTree');
            nTree.destroy();
        });
        beforeEach(() => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 404,
                'contentType': 'application/json',
                'responseText': 'Page not found'
            });
        });
        it('actionFailure after destroyed', () => {
            expect(actionFailedFunction).not.toHaveBeenCalled();
        });

        afterAll(() => {
            ele.remove();
            jasmine.Ajax.uninstall();
        });
    });


    describe('mouse events', () => {
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: dataSource });
            treeObj.appendTo(ele);
        });

        it('mouse click event', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.curUL.querySelectorAll('li');
            mouseEventArgs.target = li[2].firstChild;
            expect((li[2] as Element).classList.contains('e-active')).toBe(false);
            treeObj.clickHandler(mouseEventArgs);
            expect((li[2] as Element).classList.contains('e-active')).toBe(true);
        });

        it('mouse click event', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.curUL.querySelectorAll('li');
            mouseEventArgs.target = li[0];
            expect((li[0] as Element).classList.contains('e-active')).toBe(false);
            treeObj.clickHandler(mouseEventArgs);
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
        });

        // it('mouse click event change select', () => {
        //     let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.curUL.querySelectorAll('li');
        //     mouseEventArgs.target = li[2].firstChild;
        //     expect((li[2] as Element).classList.contains('e-active')).toBe(false);
        //     treeObj.clickHandler(mouseEventArgs);
        //     expect((li[2] as Element).classList.contains('e-active')).toBe(true);
        // });

        it('mouse hover event', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.curUL.querySelectorAll('li');
            mouseEventArgs.target = li[0].firstChild;
            expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
            treeObj.hoverHandler(mouseEventArgs);
            expect((li[0] as Element).classList.contains('e-hover')).toBe(true);
        });

        it('mouse leave event', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.curUL.querySelectorAll('li');
            mouseEventArgs.target = li[0].firstChild;
            expect((li[0] as Element).classList.contains('e-hover')).toBe(true);
            treeObj.leaveHandler(mouseEventArgs);
            expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
        });
        afterAll(() => {
            ele.remove();
        });
    });

    describe('animation', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: dataSource });
            treeObj.appendTo(ele);
        });

        describe('switch view', () => {
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                target: null
            };
            let curUL: Element;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                mouseEventArgs.target = curUL.querySelectorAll('li')[0];
                treeObj.clickHandler(mouseEventArgs);
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });

        describe('mouse click on back button', () => {
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                target: null
            };
            let curUL: Element;
            beforeEach((done: Function) => {
                let backButtonEle: Element = createElement('div', { className: 'e-icon-back' });
                mouseEventArgs.target = backButtonEle;
                curUL = treeObj.curUL;
                treeObj.clickHandler(mouseEventArgs);
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(isVisible(curUL)).toBe(false);
            });
            afterEach((done: Function) => {
                mouseEventArgs.target = treeObj.curUL.querySelectorAll('li')[0];
                treeObj.clickHandler(mouseEventArgs);
                treeObj.actionComplete = () => {
                    done();
                }
            });
        });
        describe('back on header text click', () => {
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                target: null
            };
            let curUL: Element;
            beforeEach((done: Function) => {
                let backheaderEle: Element = createElement('div', { className: 'e-headertext' });
                mouseEventArgs.target = backheaderEle;
                curUL = treeObj.curUL;
                treeObj.clickHandler(mouseEventArgs);
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(isVisible(curUL)).toBe(false);
            });
        });
        describe('no animation 0ms', () => {
            let curUL: Element;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.animation.effect = 'None';
                treeObj.dataBind();
                treeObj.selectItem({ id: '01' });
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(isVisible(curUL)).toBe(false);
            });
        });

        it('switchView method when no element', () => {
            let cUL: any = treeObj.curUL;
            expect(treeObj.switchView()).toBe(undefined);
            expect(cUL).toBe(treeObj.curUL);
        });
        afterAll(() => {
            ele.remove();
        });
    });

    describe('property change', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: dataSource });
            treeObj.appendTo(ele);
        });
        it('onproperty change function call', () => {
            spyOn(treeObj, 'onPropertyChanged');
            expect(treeObj.onPropertyChanged).not.toHaveBeenCalled();
            treeObj.animation = { effect: 'SlideDown' };
            treeObj.dataBind();
            expect(treeObj.onPropertyChanged).toHaveBeenCalled();
        });

        it('enable property to be false', () => {
            expect(treeObj.element.classList.contains('e-disabled')).toBe(false);
            treeObj.enable = false;
            treeObj.dataBind();
            expect(treeObj.element.classList.contains('e-disabled')).toBe(true);
        });

        it('enable property to be true', () => {
            expect(treeObj.element.classList.contains('e-disabled')).toBe(true);
            treeObj.enable = true;
            treeObj.dataBind();
            expect(treeObj.element.classList.contains('e-disabled')).toBe(false);
        });

        it('cssClass property to set as css-classname', () => {
            expect(treeObj.element.classList.contains('css-classname')).toBe(false);
            treeObj.cssClass = 'css-classname';
            treeObj.dataBind();
            expect(treeObj.element.classList.contains('css-classname')).toBe(true);
        });

        it('cssClass property to set as css-newclassname', () => {
            expect(treeObj.element.classList.contains('css-newclassname')).toBe(false);
            expect(treeObj.element.classList.contains('css-classname')).toBe(true);
            treeObj.cssClass = 'css-newclassname';
            treeObj.dataBind();
            expect(treeObj.element.classList.contains('css-classname')).toBe(false);
            expect(treeObj.element.classList.contains('css-newclassname')).toBe(true);
        });

        it('htmlAttributes property', () => {
            expect(treeObj.element.getAttribute('title')).toBe(null);
            treeObj.htmlAttributes = { title: 'ListView' };
            treeObj.dataBind();
            expect(treeObj.element.getAttribute('title')).toBe('ListView');
        });

        it('height property', () => {
            expect(treeObj.element.style.height).toBe('');
            treeObj.height = '200px';
            treeObj.dataBind();
            expect(treeObj.element.style.height).toBe('200px');
        });
        it('height property in number', () => {
            treeObj.height = 300;
            treeObj.dataBind();
            expect(treeObj.element.style.height).toBe('300px');
        });

        it('width property', () => {
            expect(treeObj.element.style.width).toBe('');
            treeObj.width = '200px';
            treeObj.dataBind();
            expect(treeObj.element.style.width).toBe('200px');
        });

        it('width property in number', () => {
            treeObj.width = 300;
            treeObj.dataBind();
            expect(treeObj.element.style.width).toBe('300px');
        });

        it('enable RTL property', () => {
            treeObj.enableRtl = true;
            treeObj.dataBind();
            expect(treeObj.element.classList.contains('e-rtl')).toBe(true);
        });

        it('enable RTL property', () => {
            treeObj.enableRtl = false;
            treeObj.dataBind();
            expect(treeObj.element.classList.contains('e-rtl')).toBe(false);
        });

        it('dataSource property', () => {
            treeObj.dataSource = [{ id: '01', text: 'First One', subText: '1st' }, { id: '02', text: 'Second One', subText: '2nd' }];
            treeObj.dataBind();
            expect(treeObj.curUL.querySelectorAll('li').length).toBe(2);
        });

        it('fields property', () => {
            expect(treeObj.curUL.querySelector('.e-list-text').innerHTML).toBe('First One');
            treeObj.fields = { text: 'subText', id: 'id' };
            treeObj.dataBind();
            expect(treeObj.curUL.querySelector('.e-list-text').innerHTML).toBe('1st');
        });

        it('sortOrder property', () => {
            expect(treeObj.curUL.querySelector('.e-list-text').innerHTML).toBe('1st');
            treeObj.sortOrder = 'Descending';
            treeObj.dataBind();
            expect(treeObj.curUL.querySelector('.e-list-text').innerHTML).toBe('2nd');
        });

        it('headerTitle property', () => {
            treeObj.headerTitle = 'Custom Title';
            treeObj.showHeader = true;
            treeObj.dataBind();
            expect(treeObj.element.querySelector('.e-headertext').innerHTML).toBe('Custom Title');
        });

        it('showHeader property', () => {
            treeObj.showHeader = false;
            treeObj.dataBind();
            expect(treeObj.element.querySelector('.e-header').style.display).toBe('none');
        });

        afterAll(() => {
            ele.remove();
        });

    });

    describe('grouping list', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: dataSource, fields: { id: 'id', text: 'text', groupBy: 'category' } });
            treeObj.appendTo(ele);
        });
        it('element grouped', () => {
            expect(treeObj.element.querySelectorAll('li').length).toBe(5);
        });
        describe('sub child navigation on grouped list', () => {
            let curUL: Element;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.selectItem({ id: '01' });
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });
        afterAll(() => {
            ele.remove();
        });

    });

    describe('sorting list', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });

        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: dataSource, sortOrder: 'Descending' });
            treeObj.appendTo(ele);
        });
        it('sorting in desending order', () => {
            expect(treeObj.element.querySelectorAll('li').length).toBe(3);
            expect(treeObj.liCollection[0].querySelector('.e-list-text').innerHTML).toBe('text3');
        });

        afterAll(() => {
            ele.remove();
        });

    });

    describe('events', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: dataSource });
            treeObj.appendTo(ele);
        });
        it('select event call', () => {
            let selectFn: Function = jasmine.createSpy('selectFun');
            treeObj.select = selectFn;
            treeObj.selectItem({ id: '03' });
            expect(selectFn).toHaveBeenCalledWith(
                {
                    name: 'select',
                    item: treeObj.liCollection[2], text: 'text3',
                    data: { id: '03', text: 'text3', icon: 'iconClass3', category: 'a' }
                });
        });

        it('actionComplete event call', () => {
            let actionComplete: Function = jasmine.createSpy('complete');
            treeObj.actionComplete = actionComplete;
            treeObj.dataSource = [{ id: '01', text: '01' }];
            treeObj.dataBind();
            expect(actionComplete).toHaveBeenCalled();
        });

        describe('actionFailure event', () => {
            let actionFailedFunction: any = jasmine.createSpy('actionFailure');
            let ele: HTMLElement = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            let nTree: ListView;
            beforeAll(() => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                nTree = new ListView({
                    dataSource: new DataManager({
                        url: '/test/db',
                        adaptor: new ODataV4Adaptor
                    }),
                    fields: { id: 'EmployeeID', text: 'FirstName' },
                    actionFailure: actionFailedFunction
                });
                nTree.appendTo('#newTree');
            });
            beforeEach((done: Function) => {
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 404,
                    'contentType': 'application/json',
                    'responseText': 'Page not found'
                });
                setTimeout(() => { done(); }, 100);
            });
            it('initialized HTML data', () => {
                expect(actionFailedFunction).toHaveBeenCalled();
            });

            afterAll(() => {
                ele.remove();
                jasmine.Ajax.uninstall();
            });
        });

        afterAll(() => {
            ele.remove();
        });

    });

    describe('enable persistance', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });

        beforeEach(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: dataSource, fields: { text: 'id' }, enablePersistence: true, cssClass: 'testclass' });
            treeObj.appendTo(ele);
        });

        it('property localStorage updated test', () => {
            treeObj.destroy();
            expect(JSON.parse(window.localStorage.getItem('listviewListView')).cssClass).toBe('testclass');
            ele.remove();
        });

        it('rendering from persistance property', () => {
            expect(treeObj.element.classList.contains('testclass')).toBe(true);
        });

        afterAll(() => {
            ele.remove();
        });
    });
    describe('Create ListView using builder', () => {
        let treeObj: ListView;
        let ele: HTMLElement;
        beforeEach(() => {
            ele = createElement('div', { id: 'ListView' });
            treeObj = new listViewBuilder(ele).dataSource(dataSource).headerTitle('test').create();
        });
        it('default initialize', () => {
            expect(ele.childNodes.length).not.toBe(0);
        });

        it('class name', () => {
            expect(ele.classList.contains('e-listview')).toBe(true);
        });
        it('dataSource Binding', () => {
            expect(treeObj.dataSource).toEqual(dataSource);
        });
        afterEach(() => {
            ele.remove();
        });
    });

});