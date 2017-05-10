define(["require", "exports", "../../src/common/list-base", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom"], function (require, exports, list_base_1, util_1, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataSource = [
        { id: '01', text: 'text1', icon: 'iconClass1', attr: { role: 'li' } },
        { id: '03', text: 'text2', icon: 'iconClass2', attr: { role: 'li' }, enabled: false },
        { id: '02', text: 'text3', icon: 'iconClass3', attr: { role: 'li' }, isVisible: false },
    ];
    var dataSourceImg = [
        { id: '01', text: 'text1', icon: 'iconClass1', attr: { role: 'li' }, imageUrl: 'base/spec/img/img1.jpg', imageAttr: { height: '200px' } },
        {
            id: '03', text: 'text2', icon: 'iconClass2', attr: { role: 'li' }, enabled: false, imageUrl: 'base/spec/img/img1.jpg',
            imageAttr: { height: '200px' }
        },
        { id: '02', text: 'text3', icon: 'iconClass3', attr: { role: 'li' }, isVisible: false, },
    ];
    var dataSourceNested = [
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
    var dds = [
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
    var fields = {};
    util_1.merge(fields, list_base_1.ListBase.defaultMappedFields);
    fields.groupBy = 'category';
    describe('ListBase', function () {
        describe('Create element from string array', function () {
            it('first parent element', function () {
                var ele = list_base_1.ListBase.createList(['item1', 'item2']);
                expect(ele.tagName).toBe('UL');
            });
            it('child element existence', function () {
                var ele = list_base_1.ListBase.createList(['item1', 'item2']);
                expect(ele.childNodes.length).toBe(2);
            });
            it('parent class name', function () {
                var ele = list_base_1.ListBase.createList(['item1', 'item2']);
                expect(ele.classList.contains('e-list-parent')).toBe(true);
            });
            it('child class name', function () {
                var ele = list_base_1.ListBase.createList(['item1', 'item2']);
                var node = ele.childNodes[0];
                expect(node.classList.contains('e-list-item')).toBe(true);
                expect(node.childNodes[0].childNodes[0].classList.contains('e-list-text')).toBe(true);
            });
            it('item structure', function () {
                var ele = list_base_1.ListBase.createList(['item1', 'item2']);
                var node = ele.childNodes[0];
                expect(node.childNodes[0].tagName).toBe('DIV');
                expect(node.childNodes[0].childNodes[0].tagName).toBe('SPAN');
                expect(node.childNodes[0].childNodes[0].innerHTML).toBe('item1');
            });
            it('isSinglelevel enabled', function () {
                var ele = list_base_1.ListBase.createList(['item1', 'item2', 'item3'], null, true);
                expect(ele.childNodes.length).toEqual(3);
            });
        });
        describe('Create element from JSON', function () {
            it('default list creation', function () {
                var ele = list_base_1.ListBase.createList(dataSource);
                var node = ele.childNodes[0];
                expect(ele.tagName).toBe('UL');
                expect(ele.childNodes.length).toBe(3);
                expect(node.childNodes[0].tagName).toBe('DIV');
                expect(node.childNodes[0].childNodes[0].tagName).toBe('SPAN');
                expect(node.childNodes[0].childNodes[0].innerHTML).toBe('text1');
                expect(node.childNodes[0].childNodes[0].classList.contains('e-list-text')).toBe(true);
            });
            it('list icon class and element', function () {
                var ele = list_base_1.ListBase.createList(dataSource, { showIcon: true });
                var node = ele.childNodes[0];
                expect(ele.tagName).toBe('UL');
                expect(ele.childNodes.length).toBe(3);
                expect(node.childNodes[0].tagName).toBe('DIV');
                var iconNode = node.querySelector('.e-list-icon');
                expect(iconNode.tagName).toBe('DIV');
                expect(iconNode.classList.contains('e-list-icon')).toBe(true);
                expect(iconNode.classList.contains('iconClass1')).toBe(true);
            });
            it('list img url and img attr', function () {
                fields.imageAttributes = 'imageAttr';
                var ele = list_base_1.ListBase.createList(dataSourceImg, { fields: fields });
                var node = ele.childNodes[0];
                expect(ele.tagName).toBe('UL');
                expect(ele.childNodes.length).toBe(3);
                expect(node.childNodes[0].tagName).toBe('DIV');
                var iconNode = node.querySelector('.e-list-img');
                expect(iconNode.tagName).toBe('IMG');
                expect(iconNode.classList.contains('e-list-img')).toBe(true);
                expect(iconNode.getAttribute('height')).toBe('200px');
            });
            it('list checkbox class and element', function () {
                var ele = list_base_1.ListBase.createList(dataSource, { showCheckBox: true });
                var node = ele.childNodes[0];
                expect(ele.tagName).toBe('UL');
                expect(ele.childNodes.length).toBe(3);
                expect(node.childNodes[0].tagName).toBe('DIV');
                var iconNode = node.querySelector('.e-list-check');
                expect(iconNode.tagName).toBe('DIV');
                expect(iconNode.classList.contains('e-list-check')).toBe(true);
            });
            it('expandCollapse option enable', function () {
                var ele = list_base_1.ListBase.createList(dataSourceNested, { expandCollapse: true });
                var node = ele.childNodes[0];
                expect(ele.tagName).toBe('UL');
                expect(ele.childNodes.length).toBe(3);
                expect(node.childNodes[0].tagName).toBe('DIV');
                var iconNode = node.querySelector('.e-icon-collapsible');
                expect(iconNode.tagName).toBe('DIV');
                expect(iconNode.classList.contains('e-icon-collapsible')).toBe(true);
            });
            it('nested list creation', function () {
                var ele = list_base_1.ListBase.createList(dataSourceNested, { processSubChild: true });
                var node = ele.childNodes[0];
                var subNode = node.childNodes[1];
                var subNodeDIV = subNode.childNodes[1];
                expect(ele.tagName).toBe('UL');
                expect(ele.childNodes.length).toBe(3);
                expect(node.childNodes[0].tagName).toBe('DIV');
                expect(node.childNodes[0].childNodes[0].tagName).toBe('SPAN');
                expect(node.childNodes[0].childNodes[0].innerHTML).toBe('text1');
                expect(node.childNodes[0].childNodes[0].classList.contains('e-list-text')).toBe(true);
                expect(subNode.childNodes.length).toBe(3);
                expect(subNode.childNodes[0].tagName).toBe('LI');
                expect(subNodeDIV.childNodes[0].tagName).toBe('DIV');
                expect(subNodeDIV.childNodes[0].childNodes[0].tagName).toBe('SPAN');
                expect(subNodeDIV.childNodes[0].childNodes[0].innerHTML).toBe('subText2');
                expect(subNodeDIV.childNodes[0].childNodes[0].classList.contains('e-list-text')).toBe(true);
            });
            it('nested list creation fist level nodes', function () {
                var ele = list_base_1.ListBase.createList(dataSourceNested);
                var node = ele.childNodes[0];
                expect(ele.tagName).toBe('UL');
                expect(ele.childNodes.length).toBe(3);
                expect(node.childNodes[0].querySelector('ul')).toBe(null);
            });
            it('groupped list creation', function () {
                var ds = list_base_1.ListBase.groupDataSource(dds, fields);
                var ele = list_base_1.ListBase.createList(ds);
                var node = ele.childNodes[0];
                expect(ele.tagName).toBe('UL');
                expect(ele.childNodes.length).toBe(5);
                expect((node).classList.contains('e-list-group-item')).toBe(true);
            });
            it('Single level with grouping', function () {
                fields.text = 'text';
                fields.value = 'text';
                var options = { showIcon: true, fields: fields };
                var ds = list_base_1.ListBase.groupDataSource(dds, fields);
                var ele = list_base_1.ListBase.createList(ds, options, true);
                var node = ele.childNodes[0];
            });
            it('title field mapping', function () {
                fields.tooltip = 'text';
                var ele = list_base_1.ListBase.createList(dataSource, { fields: fields });
                var node = ele.childNodes[0];
                expect(ele.tagName).toBe('UL');
                expect(node.getAttribute('title')).toBe('text1');
            });
            it('htmlAttributes field mapping', function () {
                fields.htmlAttributes = 'attr';
                var ele = list_base_1.ListBase.createList(dataSource, { fields: fields });
                var node = ele.childNodes[0];
                expect(ele.tagName).toBe('UL');
                expect(node.getAttribute('role')).toBe('li');
            });
            it('enable field mapping', function () {
                var ele = list_base_1.ListBase.createList(dataSource, { fields: fields });
                var node = ele.childNodes[1];
                expect(ele.tagName).toBe('UL');
                expect(node.classList.contains('e-disabled')).toBe(true);
            });
            it('visible field mapping', function () {
                var ele = list_base_1.ListBase.createList(dataSource, { fields: fields });
                var node = ele.childNodes[2];
                expect(ele.tagName).toBe('UL');
                expect(node.style.display).toBe('none');
            });
        });
        describe('HTMLData to JSON converter', function () {
            var ele = document.createElement('ul');
            ele.innerHTML = '<li>item1<ul><li>sub1</li><li>sub2</li><li>sub3</li></ul></li>' +
                '<li>item2</li><li>item3</li><li>item4</li><li>item5</li>' +
                '<li>item6</li><li>item7</li>';
            it('UL LI to JSON', function () {
                var e = list_base_1.ListBase.createJsonFromElement(ele);
                expect(e.length).toBe(7);
            });
            it('sublevel child creation', function () {
                var e = list_base_1.ListBase.createJsonFromElement(ele);
                expect(e[0].child.length).toBe(3);
            });
        });
        describe('get sibling LI', function () {
            var ele = document.createElement('ul');
            ele.id = 'uls';
            ele.innerHTML = '<li id="i1">item1<ul><li id="s1">sub1</li><li id="s2">sub2</li><li id="s3">sub3</li></ul></li>' +
                '<li id="i2" style="display:none">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
                '<li>item6</li><li>item7</li>';
            it('get next sibling', function () {
                document.body.appendChild(ele);
                var li = ele.querySelector('#i4');
                var nextLI = ele.querySelector('#i5');
                expect(list_base_1.ListBase.getSiblingLI(ele.querySelectorAll('li'), li)).toBe(nextLI);
            });
            it('get previous sibling', function () {
                document.body.appendChild(ele);
                var li = ele.querySelector('#i4');
                var nextLI = ele.querySelector('#i3');
                expect(list_base_1.ListBase.getSiblingLI(ele.querySelectorAll('li'), li, true)).toBe(nextLI);
            });
            it('get previous visible sibling', function () {
                document.body.appendChild(ele);
                var li = ele.querySelector('#i3');
                var nextLI = ele.querySelector('#s3');
                expect(list_base_1.ListBase.getSiblingLI(ele.querySelectorAll('li'), li, true)).toBe(nextLI);
            });
            it('get next visible sibling', function () {
                document.body.appendChild(ele);
                var li = ele.querySelector('#s3');
                var nextLI = ele.querySelector('#i3');
                expect(list_base_1.ListBase.getSiblingLI(ele.querySelectorAll('li'), li)).toBe(nextLI);
            });
            it('get first visible li from array', function () {
                document.body.appendChild(ele);
                var li = ele.querySelector('#s');
                expect(list_base_1.ListBase.getSiblingLI(ele.querySelectorAll('li'), li)).toBe(ele.querySelector('#uls>li:first-child'));
            });
            it('get last visible li from array', function () {
                document.body.appendChild(ele);
                var li = ele.querySelector('#s');
                expect(list_base_1.ListBase.getSiblingLI(ele.querySelectorAll('li'), li, true)).toBe(ele.querySelector('#uls>li:last-child'));
            });
            it('get siblings li when no array list', function () {
                document.body.appendChild(ele);
                var li = ele.querySelector('#s');
                expect(list_base_1.ListBase.getSiblingLI([], li)).toBe(undefined);
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('indexOf method', function () {
            var ele = document.createElement('ul');
            ele.id = 'uls';
            ele.innerHTML = '<li id="i1">item1<ul><li id="s1">sub1</li><li id="s2">sub2</li><li id="s3">sub3</li></ul></li>' +
                '<li id="i2" style="display:none">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
                '<li>item6</li><li>item7</li>';
            it('li from node list', function () {
                document.body.appendChild(ele);
                var li = ele.querySelector('#i4');
                expect(list_base_1.ListBase.indexOf(li, ele.querySelectorAll('#uls>li'))).toBe(3);
            });
            it('li not in list', function () {
                document.body.appendChild(ele);
                var li = ele.querySelector('#i4');
                expect(list_base_1.ListBase.indexOf(li, ele.querySelectorAll('p'))).toBe(-1);
            });
            it('element is empty', function () {
                document.body.appendChild(ele);
                var li = ele.querySelector('#i');
                expect(list_base_1.ListBase.indexOf(li, ele.querySelectorAll('li'))).toBe(undefined);
            });
            afterAll(function () {
                ele.remove();
            });
        });
        describe('sorting data source', function () {
            it('default', function () {
                var newDS = list_base_1.ListBase.getDataSource(dataSource, list_base_1.ListBase.addSorting('None', 'id'));
                expect(newDS[0].id).toBe('01');
                expect(newDS[1].id).toBe('03');
            });
            it('sorting order by ascending', function () {
                var newDS = list_base_1.ListBase.getDataSource(dataSource, list_base_1.ListBase.addSorting('Ascending', 'id'));
                expect(newDS[0].id).toBe('01');
                expect(newDS[1].id).toBe('02');
            });
            it('sorting order by descending', function () {
                var newDS = list_base_1.ListBase.getDataSource(dataSource, list_base_1.ListBase.addSorting('Descending', 'id'));
                expect(newDS[0].id).toBe('03');
                expect(newDS[1].id).toBe('02');
            });
        });
        describe('group data source', function () {
            it('default', function () {
                var newDS = list_base_1.ListBase.groupDataSource(dds, fields);
                expect(newDS.length).toBe(5);
                expect(newDS[0].text).toBe('a');
                expect(newDS[3].text).toBe('b');
            });
            it('ascending order', function () {
                var newDS = list_base_1.ListBase.groupDataSource(dds, fields, 'Ascending');
                expect(newDS.length).toBe(5);
                expect(newDS[0].text).toBe('a');
                expect(newDS[3].text).toBe('b');
            });
            it('descending order', function () {
                var newDS = list_base_1.ListBase.groupDataSource(dds, fields, 'Descending');
                expect(newDS.length).toBe(5);
                expect(newDS[0].text).toBe('b');
                expect(newDS[2].text).toBe('a');
            });
        });
        describe('Template', function () {
            var data1 = [
                { 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }, { 'text': 'Audi A7', 'id': 'a0cc', 'category': 'Audi' },
                { 'text': 'BMW 501', 'id': 'f8435', 'category': 'BMW' }, { 'text': 'BMW 3', 'id': 'b2b1', 'category': 'BMW' }
            ];
            var datasource = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
                { id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }];
            it('ContentTemplate with fields', function () {
                var template = '<div class="ename"> ${text} </div><div class="desig"> ${id} </div>';
                fields.value = 'text';
                var newDS = list_base_1.ListBase.renderContentTemplate(template, datasource, fields);
                var items = newDS.querySelectorAll('li');
                expect(items.length).toBe(5);
                expect(items[4].getAttribute('data-value')).toEqual('Oracle');
            });
            it('groupTemplate with sorting', function () {
                var template1 = '<div class="ename"> ${text} </div><div class="desig"> ${id} </div>';
                fields.groupBy = 'category';
                fields.text = 'text';
                data1 = list_base_1.ListBase.groupDataSource(data1, fields);
                var newDS1 = list_base_1.ListBase.renderContentTemplate(template1, data1, fields);
                var item = newDS1.querySelectorAll('.e-list-group-item');
                expect(item.length).toBe(2);
                var template = '<div class="desig"> ${id} </div><div class="ename"> ${text} </div>';
                var newDS = list_base_1.ListBase.renderGroupTemplate(template, data1, fields, item);
                expect(newDS[0].firstElementChild.classList.contains('desig')).toBe(true);
            });
            it('groupTemplate without grouping', function () {
                var template1 = '<div class="ename"> ${text} </div><div class="desig"> ${id} </div>';
                var newDS1 = list_base_1.ListBase.renderContentTemplate(template1, data1, fields);
                var item = newDS1.querySelectorAll('.e-list-group-item');
                fields.groupBy = null;
                var newDS2 = list_base_1.ListBase.renderGroupTemplate(template1, data1, fields, item);
                expect(item).toBe(newDS2);
            });
            it('ContentTemplate with text fields', function () {
                var datasource = [{ id: 'list1', name: 'JAVA', icon: 'icon' }, { id: 'list2', name: 'C#' },
                    { id: 'list3', name: 'C++' }, { id: 'list4', name: '.NET', icon: 'icon' }, { id: 'list5', name: 'Oracle' }
                ];
                fields.text = 'name';
                fields.value = 'name';
                var template = '<div class="ename"> ${name} </div><div class="desig"> ${id} </div>';
                var newDS = list_base_1.ListBase.renderContentTemplate(template, datasource, fields);
                var items = newDS.querySelectorAll('li');
                expect(items.length).toBe(5);
                expect(items[0].getAttribute('data-value')).toEqual('JAVA');
            });
            it('testing item template alone in the list', function () {
                var template = '<div class="e-item"> ${text} </div>';
                var ds = list_base_1.ListBase.groupDataSource(dds, { groupBy: 'category' });
                var listOptions = {
                    fields: { groupBy: 'category' },
                    template: template
                };
                var lists = list_base_1.ListBase.createList(ds, listOptions);
                expect(dom_1.selectAll('.e-list-item .e-item', lists).length).not.toEqual(0);
            });
            it('testing group header template alone in the list', function () {
                var template = '<div class="e-group"> ${text} </div>';
                var ds = list_base_1.ListBase.groupDataSource(dds, { groupBy: 'category' });
                var listOptions = {
                    fields: { groupBy: 'category' },
                    groupTemplate: template
                };
                var lists = list_base_1.ListBase.createList(ds, listOptions);
                expect(dom_1.selectAll('.e-list-group-item .e-group', lists).length).not.toEqual(0);
            });
            it('testing item and group header template in the list', function () {
                var listOptions = {
                    fields: { groupBy: 'category' },
                    template: '<div class="e-item"> ${text} </div>',
                    groupTemplate: '<div class="e-group"> ${text} </div>'
                };
                var ds = list_base_1.ListBase.groupDataSource(dds, { groupBy: 'category' });
                var lists = list_base_1.ListBase.createList(ds, listOptions);
                expect(dom_1.selectAll('.e-list-item .e-item', lists).length).not.toEqual(0);
                expect(dom_1.selectAll('.e-list-group-item .e-group', lists).length).not.toEqual(0);
            });
        });
    });
});
