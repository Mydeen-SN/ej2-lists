import { ListBase, SortOrder, ListBaseOptions } from '../../src/common/list-base';
import { merge } from '@syncfusion/ej2-base/util';
import { selectAll } from '@syncfusion/ej2-base/dom';

/**
 * ListBase Spec
 */
let dataSource: { [key: string]: Object }[] = [
    { id: '01', text: 'text1', icon: 'iconClass1', attr: { role: 'li' } },
    { id: '03', text: 'text2', icon: 'iconClass2', attr: { role: 'li' }, enabled: false },
    { id: '02', text: 'text3', icon: 'iconClass3', attr: { role: 'li' }, isVisible: false },
];

let dataSourceImg: { [key: string]: Object }[] = [
    { id: '01', text: 'text1', icon: 'iconClass1', attr: { role: 'li' }, imageUrl: 'base/spec/img/img1.jpg', imageAttr: { height: '200px' } },
    {
        id: '03', text: 'text2', icon: 'iconClass2', attr: { role: 'li' }, enabled: false, imageUrl: 'base/spec/img/img1.jpg',
        imageAttr: { height: '200px' }
    },
    { id: '02', text: 'text3', icon: 'iconClass3', attr: { role: 'li' }, isVisible: false, },
];

let dataSourceNested: { [key: string]: Object }[] = [
    {
        id: '01', text: 'text1', icon: 'iconClass1',
        child: [{ id: '01_1', text: 'subText1', icon: 'iconSubClass1' },
        { id: '01_2', text: 'subText2', icon: 'iconSubClass2' },
        { id: '01_3', text: 'subText3', icon: 'iconSubClass3' }]
    },
    {
        id: '02', text: 'text2', icon: 'iconClass2',
        child: [{ id: '02_1', text: 'subItemText1', icon: 'iconSubClass1' },
        { id: '02_2', text: 'subItemText2', icon: 'iconSubClass2' },
        { id: '02_3', text: 'subItemText3', icon: 'iconSubClass3' }]
    },
    {
        id: '03', text: 'text3', icon: 'iconClass3',
        child: [{ id: '01_1', text: 'subText1', icon: 'iconSubClass1' },
        { id: '01_2', text: 'subText2', icon: 'iconSubClass2' },
        { id: '01_3', text: 'subText3', icon: 'iconSubClass3' }]
    },
];

let dds: { [key: string]: Object }[] = [
    {
        id: '01', text: 'text1', icon: 'iconClass1', category: 'a',
        child: [{ id: '01_1', text: 'subText1', icon: 'iconSubClass1' },
        { id: '01_2', text: 'subText2', icon: 'iconSubClass2' },
        { id: '01_3', text: 'subText3', icon: 'iconSubClass3' }]
    },
    {
        id: '02', text: 'text2', icon: 'iconClass2', category: 'a',
        child: [{ id: '02_1', text: 'subItemText1', icon: 'iconSubClass1' },
        { id: '02_2', text: 'subItemText2', icon: 'iconSubClass2' },
        { id: '02_3', text: 'subItemText3', icon: 'iconSubClass3' }]
    },
    {
        id: '03', text: 'text3', icon: 'iconClass3', category: 'b',
        child: [{ id: '01_1', text: 'subText1', icon: 'iconSubClass1' },
        { id: '01_2', text: 'subText2', icon: 'iconSubClass2' },
        { id: '01_3', text: 'subText3', icon: 'iconSubClass3' }]
    },
];

let fields: any = {};
merge(fields, ListBase.defaultMappedFields);
fields.groupBy = 'category';

describe('ListBase', () => {

    describe('Create element from string array', () => {

        it('first parent element', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(['item1', 'item2']);
            expect(ele.tagName).toBe('UL');
        });

        it('child element existence', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(['item1', 'item2']);
            expect(ele.childNodes.length).toBe(2);
        });

        it('parent class name', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(['item1', 'item2']);
            expect(ele.classList.contains('e-list-parent')).toBe(true);
        });

        it('child class name', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(['item1', 'item2']);
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
            expect(node.classList.contains('e-list-item')).toBe(true);
            expect((node.childNodes[0].childNodes[0] as HTMLElement).classList.contains('e-list-text')).toBe(true);
        });

        it('item structure', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(['item1', 'item2']);
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
            expect((node.childNodes[0] as HTMLElement).tagName).toBe('DIV');
            expect((node.childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('SPAN');
            expect((node.childNodes[0].childNodes[0] as HTMLElement).innerHTML).toBe('item1');
        });
        it('isSinglelevel enabled', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(['item1', 'item2', 'item3'], null, true);
            expect(ele.childNodes.length).toEqual(3);
        });

    });


    describe('Create element from JSON', () => {


        it('default list creation', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(dataSource);
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
            expect(ele.tagName).toBe('UL');
            expect(ele.childNodes.length).toBe(3);
            expect((node.childNodes[0] as HTMLElement).tagName).toBe('DIV');
            expect((node.childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('SPAN');
            expect((node.childNodes[0].childNodes[0] as HTMLElement).innerHTML).toBe('text1');
            expect((node.childNodes[0].childNodes[0] as HTMLElement).classList.contains('e-list-text')).toBe(true);
        });

        it('list icon class and element', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(dataSource, { showIcon: true });
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
            expect(ele.tagName).toBe('UL');
            expect(ele.childNodes.length).toBe(3);
            expect((node.childNodes[0] as HTMLElement).tagName).toBe('DIV');
            let iconNode: HTMLElement = <HTMLElement>node.querySelector('.e-list-icon');
            expect(iconNode.tagName).toBe('DIV');
            expect(iconNode.classList.contains('e-list-icon')).toBe(true);
            expect(iconNode.classList.contains('iconClass1')).toBe(true);
        });

        it('list img url and img attr', () => {
            fields.imageAttributes = 'imageAttr';
            let ele: HTMLElement = <HTMLElement>ListBase.createList(dataSourceImg, { fields: fields });
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
            expect(ele.tagName).toBe('UL');
            expect(ele.childNodes.length).toBe(3);
            expect((node.childNodes[0] as HTMLElement).tagName).toBe('DIV');
            let iconNode: HTMLElement = <HTMLElement>node.querySelector('.e-list-img');
            expect(iconNode.tagName).toBe('IMG');
            expect(iconNode.classList.contains('e-list-img')).toBe(true);
            expect(iconNode.getAttribute('height')).toBe('200px');
        });

        it('list checkbox class and element', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(dataSource, { showCheckBox: true });
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
            expect(ele.tagName).toBe('UL');
            expect(ele.childNodes.length).toBe(3);
            expect((node.childNodes[0] as HTMLElement).tagName).toBe('DIV');
            let iconNode: HTMLElement = <HTMLElement>node.querySelector('.e-list-check');
            expect(iconNode.tagName).toBe('DIV');
            expect(iconNode.classList.contains('e-list-check')).toBe(true);
        });

        it('expandCollapse option enable', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(dataSourceNested, { expandCollapse: true });
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
            expect(ele.tagName).toBe('UL');
            expect(ele.childNodes.length).toBe(3);
            expect((node.childNodes[0] as HTMLElement).tagName).toBe('DIV');
            let iconNode: HTMLElement = <HTMLElement>node.querySelector('.e-icon-collapsible');
            expect(iconNode.tagName).toBe('DIV');
            expect(iconNode.classList.contains('e-icon-collapsible')).toBe(true);
        });

        it('nested list creation', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(dataSourceNested, { processSubChild: true });
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
            let subNode: HTMLElement = <HTMLElement>node.childNodes[1];
            let subNodeDIV: HTMLElement = <HTMLElement>subNode.childNodes[1];

            expect(ele.tagName).toBe('UL');
            expect(ele.childNodes.length).toBe(3);
            expect((node.childNodes[0] as HTMLElement).tagName).toBe('DIV');
            expect((node.childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('SPAN');
            expect((node.childNodes[0].childNodes[0] as HTMLElement).innerHTML).toBe('text1');
            expect((node.childNodes[0].childNodes[0] as HTMLElement).classList.contains('e-list-text')).toBe(true);
            expect(subNode.childNodes.length).toBe(3);
            expect((subNode.childNodes[0] as HTMLElement).tagName).toBe('LI');
            expect((subNodeDIV.childNodes[0] as HTMLElement).tagName).toBe('DIV');
            expect((subNodeDIV.childNodes[0].childNodes[0] as HTMLElement).tagName).toBe('SPAN');
            expect((subNodeDIV.childNodes[0].childNodes[0] as HTMLElement).innerHTML).toBe('subText2');
            expect((subNodeDIV.childNodes[0].childNodes[0] as HTMLElement).classList.contains('e-list-text')).toBe(true);
        });

        it('nested list creation fist level nodes', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(dataSourceNested);
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
            expect(ele.tagName).toBe('UL');
            expect(ele.childNodes.length).toBe(3);
            expect((node.childNodes[0] as Element).querySelector('ul')).toBe(null);
        });

        it('groupped list creation', () => {
            let ds: any = ListBase.groupDataSource(dds, fields);
            let ele: HTMLElement = <HTMLElement>ListBase.createList(ds);
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
            expect(ele.tagName).toBe('UL');
            expect(ele.childNodes.length).toBe(5);
            expect((node).classList.contains('e-list-group-item')).toBe(true);
        });

        it('Single level with grouping', () => {
            fields.text = 'text';
            fields.value = 'text';
            let options: Object = { showIcon: true, fields: fields };
            let ds: any = ListBase.groupDataSource(dds, fields);
            let ele: HTMLElement = <HTMLElement>ListBase.createList(ds, options, true);
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
        });

        it('title field mapping', () => {
            fields.tooltip = 'text';
            let ele: HTMLElement = <HTMLElement>ListBase.createList(dataSource, { fields: fields });
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
            expect(ele.tagName).toBe('UL');
            expect(node.getAttribute('title')).toBe('text1');
        });

        it('htmlAttributes field mapping', () => {
            fields.htmlAttributes = 'attr';
            let ele: HTMLElement = <HTMLElement>ListBase.createList(dataSource, { fields: fields });
            let node: HTMLElement = <HTMLElement>ele.childNodes[0];
            expect(ele.tagName).toBe('UL');
            expect(node.getAttribute('role')).toBe('li');
        });

        it('enable field mapping', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(dataSource, { fields: fields });
            let node: HTMLElement = <HTMLElement>ele.childNodes[1];
            expect(ele.tagName).toBe('UL');
            expect(node.classList.contains('e-disabled')).toBe(true);
        });

        it('visible field mapping', () => {
            let ele: HTMLElement = <HTMLElement>ListBase.createList(dataSource, { fields: fields });
            let node: HTMLElement = <HTMLElement>ele.childNodes[2];
            expect(ele.tagName).toBe('UL');
            expect(node.style.display).toBe('none');
        });
    });

    describe('HTMLData to JSON converter', () => {
        let ele: HTMLElement = document.createElement('ul');
        ele.innerHTML = '<li>item1<ul><li>sub1</li><li>sub2</li><li>sub3</li></ul></li>' +
            '<li>item2</li><li>item3</li><li>item4</li><li>item5</li>' +
            '<li>item6</li><li>item7</li>';

        it('UL LI to JSON', () => {
            let e: Object[] = ListBase.createJsonFromElement(ele);
            expect(e.length).toBe(7);
        });

        it('sublevel child creation', () => {
            let e: any = ListBase.createJsonFromElement(ele);
            expect(e[0].child.length).toBe(3);
        });
    });

    describe('get sibling LI', () => {
        let ele: HTMLElement = document.createElement('ul');
        ele.id = 'uls';
        ele.innerHTML = '<li id="i1">item1<ul><li id="s1">sub1</li><li id="s2">sub2</li><li id="s3">sub3</li></ul></li>' +
            '<li id="i2" style="display:none">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
            '<li>item6</li><li>item7</li>';

        it('get next sibling', () => {
            document.body.appendChild(ele);
            let li: HTMLElement = <HTMLElement>ele.querySelector('#i4');
            let nextLI: HTMLElement = <HTMLElement>ele.querySelector('#i5');
            expect(ListBase.getSiblingLI(ele.querySelectorAll('li'), li)).toBe(nextLI);
        });

        it('get previous sibling', () => {
            document.body.appendChild(ele);
            let li: HTMLElement = <HTMLElement>ele.querySelector('#i4');
            let nextLI: HTMLElement = <HTMLElement>ele.querySelector('#i3');
            expect(ListBase.getSiblingLI(ele.querySelectorAll('li'), li, true)).toBe(nextLI);
        });

        it('get previous visible sibling', () => {
            document.body.appendChild(ele);
            let li: HTMLElement = <HTMLElement>ele.querySelector('#i3');
            let nextLI: HTMLElement = <HTMLElement>ele.querySelector('#s3');
            expect(ListBase.getSiblingLI(ele.querySelectorAll('li'), li, true)).toBe(nextLI);
        });

        it('get next visible sibling', () => {
            document.body.appendChild(ele);
            let li: HTMLElement = <HTMLElement>ele.querySelector('#s3');
            let nextLI: HTMLElement = <HTMLElement>ele.querySelector('#i3');
            expect(ListBase.getSiblingLI(ele.querySelectorAll('li'), li)).toBe(nextLI);
        });

        it('get first visible li from array', () => {
            document.body.appendChild(ele);
            let li: HTMLElement = <HTMLElement>ele.querySelector('#s');
            expect(ListBase.getSiblingLI(ele.querySelectorAll('li'), li)).toBe(ele.querySelector('#uls>li:first-child'));
        });

        it('get last visible li from array', () => {
            document.body.appendChild(ele);
            let li: HTMLElement = <HTMLElement>ele.querySelector('#s');
            expect(ListBase.getSiblingLI(ele.querySelectorAll('li'), li, true)).toBe(ele.querySelector('#uls>li:last-child'));
        });

        it('get siblings li when no array list', () => {
            document.body.appendChild(ele);
            let li: HTMLElement = <HTMLElement>ele.querySelector('#s');
            expect(ListBase.getSiblingLI([], li)).toBe(undefined);
        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('indexOf method', () => {
        let ele: HTMLElement = document.createElement('ul');
        ele.id = 'uls';
        ele.innerHTML = '<li id="i1">item1<ul><li id="s1">sub1</li><li id="s2">sub2</li><li id="s3">sub3</li></ul></li>' +
            '<li id="i2" style="display:none">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
            '<li>item6</li><li>item7</li>';

        it('li from node list', () => {
            document.body.appendChild(ele);
            let li: HTMLElement = <HTMLElement>ele.querySelector('#i4');
            expect(ListBase.indexOf(li, ele.querySelectorAll('#uls>li'))).toBe(3);
        });

        it('li not in list', () => {
            document.body.appendChild(ele);
            let li: HTMLElement = <HTMLElement>ele.querySelector('#i4');
            expect(ListBase.indexOf(li, ele.querySelectorAll('p'))).toBe(-1);
        });

        it('element is empty', () => {
            document.body.appendChild(ele);
            let li: HTMLElement = <HTMLElement>ele.querySelector('#i');
            expect(ListBase.indexOf(li, ele.querySelectorAll('li'))).toBe(undefined);
        });


        afterAll(() => {
            ele.remove();
        });
    });

    describe('sorting data source', (): void => {

        it('default', () => {
            let newDS: any = ListBase.getDataSource(dataSource, ListBase.addSorting('None', 'id'));
            expect(newDS[0].id).toBe('01');
            expect(newDS[1].id).toBe('03');
        });

        it('sorting order by ascending', () => {
            let newDS: any = ListBase.getDataSource(dataSource, ListBase.addSorting('Ascending', 'id'));
            expect(newDS[0].id).toBe('01');
            expect(newDS[1].id).toBe('02');
        });

        it('sorting order by descending', () => {
            let newDS: any = ListBase.getDataSource(dataSource, ListBase.addSorting('Descending', 'id'));
            expect(newDS[0].id).toBe('03');
            expect(newDS[1].id).toBe('02');
        });

    });

    describe('group data source', (): void => {
        it('default', () => {
            let newDS: any = ListBase.groupDataSource(dds, fields);
            expect(newDS.length).toBe(5);
            expect(newDS[0].text).toBe('a');
            expect(newDS[3].text).toBe('b');

        });

        it('ascending order', () => {
            let newDS: any = ListBase.groupDataSource(dds, fields, 'Ascending');
            expect(newDS.length).toBe(5);
            expect(newDS[0].text).toBe('a');
            expect(newDS[3].text).toBe('b');
        });

        it('descending order', () => {
            let newDS: any = ListBase.groupDataSource(dds, fields, 'Descending');
            expect(newDS.length).toBe(5);
            expect(newDS[0].text).toBe('b');
            expect(newDS[2].text).toBe('a');
        });
    });
    describe('Template', (): void => {
        let data1: { [key: string]: Object }[] = [
            { 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
            { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }];
        let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
        { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }];

        it('ContentTemplate with fields', () => {
            let template: string = '<div class="ename"> ${text} </div><div class="desig"> ${id} </div>';
            fields.value = 'text';
            let newDS: any = ListBase.renderContentTemplate(template, datasource, fields);
            let items: any = newDS.querySelectorAll('li');
            expect(items.length).toBe(5);
            expect(items[4].getAttribute('data-value')).toEqual('Oracle');
        });
        it('groupTemplate with sorting', () => {
            let template1: string = '<div class="ename"> ${text} </div><div class="desig"> ${id} </div>';
            fields.groupBy = 'category';
            fields.text = 'text';
            data1 = ListBase.groupDataSource(data1, fields);
            let newDS1: any = ListBase.renderContentTemplate(template1, data1, fields);
            let item: any = newDS1.querySelectorAll('.e-list-group-item');
            expect(item.length).toBe(2);
            let template: string = '<div class="desig"> ${id} </div><div class="ename"> ${text} </div>';
            let newDS: any = ListBase.renderGroupTemplate(template, data1, fields, item);
            expect(newDS[0].firstElementChild.classList.contains('desig')).toBe(true);
        });
        it('groupTemplate without grouping', () => {
            let template1: string = '<div class="ename"> ${text} </div><div class="desig"> ${id} </div>';
            let newDS1: any = ListBase.renderContentTemplate(template1, data1, fields);
            let item: any = newDS1.querySelectorAll('.e-list-group-item');
            fields.groupBy = null;
            let newDS2: any = ListBase.renderGroupTemplate(template1, data1, fields, item);
            expect(item).toBe(newDS2);
        });
        it('ContentTemplate with text fields', () => {
            let datasource: { [key: string]: Object }[] = [{ id: 'list1', name: 'JAVA', icon: 'icon' }, { id: 'list2', name: 'C#' },
            { id: 'list3', name: 'C++' }, { id: 'list4', name: '.NET', icon: 'icon' }, { id: 'list5', name: 'Oracle' }
            ];
            fields.text = 'name';
            fields.value = 'name';
            let template: string = '<div class="ename"> ${name} </div><div class="desig"> ${id} </div>';
            let newDS: any = ListBase.renderContentTemplate(template, datasource, fields);
            let items: any = newDS.querySelectorAll('li');
            expect(items.length).toBe(5);
            expect(items[0].getAttribute('data-value')).toEqual('JAVA');
        });

        it('testing item template alone in the list', function () {
            let template: string = '<div class="e-item"> ${text} </div>';
            let ds: any = ListBase.groupDataSource(dds, { groupBy: 'category' });
            let listOptions: ListBaseOptions = {
                fields: { groupBy: 'category' },
                template: template
            }
            let lists: HTMLElement = ListBase.createList(ds, listOptions);
            expect(selectAll('.e-list-item .e-item', lists).length).not.toEqual(0);
        });

        it('testing group header template alone in the list', function () {
            let template: string = '<div class="e-group"> ${text} </div>';
            let ds: any = ListBase.groupDataSource(dds, { groupBy: 'category' });
            let listOptions: ListBaseOptions = {
                fields: { groupBy: 'category' },
                groupTemplate: template
            }
            let lists: HTMLElement = ListBase.createList(ds, listOptions);
            expect(selectAll('.e-list-group-item .e-group', lists).length).not.toEqual(0);
        });

        it('testing item and group header template in the list', function () {
            let listOptions: ListBaseOptions = {
                fields: { groupBy: 'category' },
                template: '<div class="e-item"> ${text} </div>',
                groupTemplate: '<div class="e-group"> ${text} </div>'
            }
            let ds: any = ListBase.groupDataSource(dds, { groupBy: 'category' });
            let lists: HTMLElement = ListBase.createList(ds, listOptions);
            expect(selectAll('.e-list-item .e-item', lists).length).not.toEqual(0);
            expect(selectAll('.e-list-group-item .e-group', lists).length).not.toEqual(0);
        });
    });
});