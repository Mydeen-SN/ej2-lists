define(["require", "exports", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "@syncfusion/ej2-base", "@syncfusion/ej2-data"], function (require, exports, util_1, dom_1, ej2_base_1, ej2_data_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cssClass = {
        li: 'e-list-item',
        ul: 'e-list-parent e-ul',
        group: 'e-list-group-item',
        icon: 'e-list-icon',
        text: 'e-list-text',
        check: 'e-list-check',
        textContent: 'e-text-content',
        hasChild: 'e-has-child',
        level: 'e-level',
        collapsible: 'e-icon-collapsible',
        disabled: 'e-disabled',
        image: 'e-list-img'
    };
    var ListBase;
    (function (ListBase) {
        ListBase.defaultMappedFields = {
            id: 'id',
            text: 'text',
            value: 'value',
            isChecked: 'isChecked',
            enabled: 'enabled',
            expanded: 'expanded',
            iconCss: 'icon',
            child: 'child',
            isVisible: 'isVisible',
            hasChildren: null,
            tooltip: null,
            htmlAttributes: null,
            imageAttributes: null,
            imageUrl: 'imageUrl',
            groupBy: null
        };
        var defaultListBaseOptions = {
            showCheckBox: false,
            showIcon: false,
            expandCollapse: false,
            fields: ListBase.defaultMappedFields,
            listClass: '',
            itemClass: '',
            processSubChild: false,
            sortOrder: 'None',
            template: null,
            groupTemplate: null
        };
        function createList(dataSource, options, isSingleLevel) {
            if (typeof dataSource[0] === 'string') {
                return createListFromArray(dataSource, isSingleLevel);
            }
            else {
                return createListFromJson(dataSource, options, 0, isSingleLevel);
            }
        }
        ListBase.createList = createList;
        function createListFromArray(dataSource, isSingleLevel) {
            var subChild = [];
            var generateList = isSingleLevel ? generateSingleLevelLI : generateLI;
            for (var i = 0; i < dataSource.length; i++) {
                var li = generateList(dataSource[i], isSingleLevel ? dataSource[i] : null);
                subChild.push(li);
            }
            return generateUL(subChild);
        }
        ListBase.createListFromArray = createListFromArray;
        function createListFromJson(dataSource, options, level, isSingleLevel) {
            if (level === void 0) { level = 0; }
            var curOpt = util_1.extend({}, defaultListBaseOptions, options);
            var fields = util_1.extend({}, ListBase.defaultMappedFields, curOpt.fields);
            var child = [];
            var li;
            for (var i = 0; i < dataSource.length; i++) {
                var curItem = dataSource[i];
                var innerEle = [];
                if (curOpt.showCheckBox) {
                    innerEle.push(dom_1.createElement('div', { className: exports.cssClass.check }));
                }
                if (isSingleLevel === true) {
                    if (curOpt.showIcon) {
                        innerEle.push(dom_1.createElement('span', { className: exports.cssClass.icon + ' ' + curItem[fields.iconCss] }));
                    }
                    li = generateSingleLevelLI(curItem[fields.text], curItem[fields.value], curOpt.itemClass, innerEle, (curItem.hasOwnProperty('isHeader') &&
                        curItem.isHeader) ? true : false);
                }
                else {
                    li = generateLI(curItem, fields, curOpt.itemClass, innerEle, options);
                    li.classList.add(exports.cssClass.level + '-' + level);
                    li.setAttribute('aria-level', level + '');
                    if (fields.tooltip) {
                        li.setAttribute('title', curItem[fields.tooltip]);
                    }
                    if (curItem.hasOwnProperty(fields.htmlAttributes) && curItem[fields.htmlAttributes]) {
                        dom_1.attributes(li, curItem[fields.htmlAttributes]);
                    }
                    if (curItem.hasOwnProperty(fields.enabled) && curItem[fields.enabled] === false) {
                        li.classList.add(exports.cssClass.disabled);
                    }
                    if (curItem.hasOwnProperty(fields.isVisible) && curItem[fields.isVisible] === false) {
                        li.style.display = 'none';
                    }
                    processSubChild(curItem, fields, dataSource, curOpt, li, level);
                    if (curItem.hasOwnProperty(fields.imageUrl)) {
                        var attr = { src: curItem[fields.imageUrl] };
                        if (curItem.hasOwnProperty(fields.imageUrl)) {
                            util_1.merge(attr, curItem[fields.imageAttributes]);
                        }
                        dom_1.prepend([dom_1.createElement('img', { className: exports.cssClass.image, attrs: attr })], li.firstElementChild);
                    }
                    if (curOpt.showIcon && !curOpt.template) {
                        dom_1.prepend([dom_1.createElement('div', { className: exports.cssClass.icon + ' ' + curItem[fields.iconCss] })], li.firstElementChild);
                    }
                }
                child.push(li);
            }
            return generateUL(child, curOpt.listClass);
        }
        ListBase.createListFromJson = createListFromJson;
        function getSiblingLI(elementArray, element, isPrevious) {
            if (!elementArray || !elementArray.length) {
                return void 0;
            }
            var siblingLI;
            var liIndex;
            var liCollections = Array.prototype.slice.call(elementArray);
            if (element) {
                liIndex = indexOf(element, liCollections);
            }
            else {
                liIndex = (isPrevious === true ? liCollections.length : -1);
            }
            siblingLI = liCollections[liIndex + (isPrevious === true ? -1 : 1)];
            while (siblingLI && (!dom_1.isVisible(siblingLI) || siblingLI.classList.contains(exports.cssClass.disabled))) {
                liIndex = liIndex + (isPrevious === true ? -1 : 1);
                siblingLI = liCollections[liIndex];
            }
            return siblingLI;
        }
        ListBase.getSiblingLI = getSiblingLI;
        function indexOf(item, elementArray) {
            if (!elementArray || !item) {
                return void 0;
            }
            else {
                var liCollections = elementArray;
                liCollections = Array.prototype.slice.call(elementArray);
                return liCollections.indexOf(item);
            }
        }
        ListBase.indexOf = indexOf;
        function groupDataSource(dataSource, fields, sortOrder) {
            if (sortOrder === void 0) { sortOrder = 'None'; }
            var cusQuery = new ej2_data_1.Query().group(fields.groupBy);
            cusQuery = addSorting(sortOrder, 'key', cusQuery);
            var ds = getDataSource(dataSource, cusQuery);
            dataSource = [];
            for (var j = 0; j < ds.length; j++) {
                var itemObj = ds[j].items;
                var grpItem = {};
                var hdr = 'isHeader';
                grpItem[fields.text] = ds[j].key;
                grpItem[hdr] = true;
                grpItem.items = itemObj;
                dataSource.push(grpItem);
                for (var k = 0; k < itemObj.length; k++) {
                    dataSource.push(itemObj[k]);
                }
            }
            return dataSource;
        }
        ListBase.groupDataSource = groupDataSource;
        function addSorting(sortOrder, sortBy, query) {
            if (query === void 0) { query = new ej2_data_1.Query(); }
            if (sortOrder === 'Ascending') {
                query.sortBy(sortBy, 'ascending', true);
            }
            else if (sortOrder === 'Descending') {
                query.sortBy(sortBy, 'descending', true);
            }
            return query;
        }
        ListBase.addSorting = addSorting;
        function getDataSource(dataSource, query) {
            return new ej2_data_1.DataManager(dataSource)
                .executeLocal(query);
        }
        ListBase.getDataSource = getDataSource;
        function createJsonFromElement(element, options) {
            var curOpt = util_1.extend({}, defaultListBaseOptions, options);
            var fields = curOpt.fields;
            var curEle = element.cloneNode(true);
            var jsonAr = [];
            curEle.classList.add('json-parent');
            var childs = curEle.querySelectorAll('.json-parent>li');
            curEle.classList.remove('json-parent');
            for (var i = 0; i < childs.length; i++) {
                var li = childs[i];
                var ul = li.querySelector('ul');
                var json = {};
                json[fields.text] = li.firstChild.textContent;
                json[fields.id] = genUID();
                if (ul) {
                    json[fields.child] = createJsonFromElement(ul, options);
                }
                jsonAr.push(json);
            }
            return jsonAr;
        }
        ListBase.createJsonFromElement = createJsonFromElement;
        function renderContentTemplate(template, dataSource, fields) {
            var ulElement = dom_1.createElement('ul', { className: exports.cssClass.ul, attrs: { role: 'presentation' } });
            var compiledString = ej2_base_1.compile(template);
            var liCollection = [];
            for (var _i = 0, dataSource_1 = dataSource; _i < dataSource_1.length; _i++) {
                var item = dataSource_1[_i];
                var isHeader = item.isHeader;
                var li = dom_1.createElement('li', {
                    className: isHeader ? exports.cssClass.group : exports.cssClass.li, attrs: { role: 'presentation' }
                });
                if (isHeader) {
                    li.innerText = item[fields.text];
                }
                else {
                    li.innerHTML = compiledString(item);
                    var value = item[fields.value];
                    li.setAttribute('data-value', value);
                    li.setAttribute('role', 'option');
                }
                liCollection.push(li);
            }
            dom_1.append(liCollection, ulElement);
            return ulElement;
        }
        ListBase.renderContentTemplate = renderContentTemplate;
        function renderGroupTemplate(groupTemplate, groupDataSource, fields, headerItems) {
            var compiledString = ej2_base_1.compile(groupTemplate);
            for (var _i = 0, headerItems_1 = headerItems; _i < headerItems_1.length; _i++) {
                var header = headerItems_1[_i];
                header.innerHTML = compiledString({ text: header.textContent });
            }
            return headerItems;
        }
        ListBase.renderGroupTemplate = renderGroupTemplate;
        function genUID() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        function processSubChild(curItem, fields, ds, options, element, level) {
            var subDS = curItem[fields.child];
            var hasChildren = curItem[fields.hasChildren];
            if (!util_1.isUndefined(subDS)) {
                hasChildren = true;
                element.classList.add(exports.cssClass.hasChild);
                if (options.processSubChild) {
                    var subLi = createListFromJson(subDS, options, ++level);
                    element.appendChild(subLi);
                }
            }
            if (!!options.expandCollapse && hasChildren && !options.template) {
                dom_1.prepend([dom_1.createElement('div', { className: 'e-icons ' + exports.cssClass.collapsible })], element.querySelector('.' + exports.cssClass.textContent));
            }
        }
        function generateSingleLevelLI(text, value, className, innerElements, grpLI) {
            var li = dom_1.createElement('li', {
                className: (grpLI === true ? exports.cssClass.group : exports.cssClass.li) + ' ' + className,
                attrs: { role: (grpLI === true ? 'group' : 'presentation') }
            });
            if (grpLI) {
                li.innerText = text;
            }
            else {
                li.setAttribute('data-value', value);
                li.setAttribute('role', 'option');
                if (innerElements) {
                    dom_1.append(innerElements, li);
                }
                li.appendChild(document.createTextNode(text));
            }
            return li;
        }
        function generateLI(item, fields, className, innerElements, options) {
            var text = item;
            var uID;
            var grpLI;
            if (typeof item !== 'string') {
                text = item[fields.text];
                uID = item[fields.id];
                grpLI = (item.hasOwnProperty('isHeader') && item.isHeader)
                    ? true : false;
            }
            var li = dom_1.createElement('li', {
                className: (grpLI === true ? exports.cssClass.group : exports.cssClass.li) + ' ' + className,
                attrs: { role: (grpLI === true ? 'group' : 'presentation') }
            });
            if (uID) {
                li.setAttribute('uID', uID);
            }
            if (grpLI && options && options.groupTemplate) {
                var compiledString = ej2_base_1.compile(options.groupTemplate);
                li.innerHTML = compiledString(item);
            }
            else if (!grpLI && options && options.template) {
                var compiledString = ej2_base_1.compile(options.template);
                li.innerHTML = compiledString(item);
            }
            else {
                var innerDiv = dom_1.createElement('div', { className: exports.cssClass.textContent });
                if (!util_1.isUndefined(innerElements)) {
                    dom_1.append(innerElements, li);
                }
                innerDiv.appendChild(dom_1.createElement('span', { className: exports.cssClass.text, innerHTML: text, attrs: { role: 'list-item' } }));
                li.appendChild(innerDiv);
            }
            return li;
        }
        function generateUL(innerEle, className) {
            var element = dom_1.createElement('ul', { className: exports.cssClass.ul + ' ' + className, attrs: { role: 'presentation' } });
            dom_1.append(innerEle, element);
            return element;
        }
    })(ListBase = exports.ListBase || (exports.ListBase = {}));
});
