import { extend, merge, isUndefined } from '@syncfusion/ej2-base/util';
import { createElement, attributes, prepend, isVisible, append } from '@syncfusion/ej2-base/dom';
import { compile } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';

export const cssClass: ClassList = {
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

export interface ClassList {
    li: string;
    ul: string;
    group: string;
    icon: string;
    text: string;
    check: string;
    textContent: string;
    hasChild: string;
    level: string;
    collapsible: string;
    disabled: string;
    image: string;
}


/**
 * Sorting Order
 */
export type SortOrder = 'None' | 'Ascending' | 'Descending';

/** 
 * Base List Generator 
 */
export namespace ListBase {

    /**
     * Default mapped fields.
     */
    export let defaultMappedFields: FieldsMapping = {
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

    let defaultListBaseOptions: ListBaseOptions = {
        showCheckBox: false,
        showIcon: false,
        expandCollapse: false,
        fields: defaultMappedFields,
        listClass: '',
        itemClass: '',
        processSubChild: false,
        sortOrder: 'None',
        template: null,
        groupTemplate: null
    };

    /**
     * Function helps to created and return the UL Li element based on your data.
     * @param  {{[key:string]:Object}[]|string[]} dataSource - Specifies an array of JSON or String data. 
     * @param  {ListBaseOptions} options? - Specifies the list options that need to provide. 
     */
    export function createList(
        dataSource: { [key: string]: Object }[] | string[], options?: ListBaseOptions, isSingleLevel?: boolean):
        HTMLElement {
        if (typeof dataSource[0] === 'string') {
            return createListFromArray(<string[]>dataSource, isSingleLevel);
        } else {
            return createListFromJson(<{ [key: string]: Object }[]>dataSource, options, 0, isSingleLevel);
        }
    }

    /**
     * Function helps to created an element list based on string array input .
     * @param  {string[]} dataSource - Specifies an array of string data
     */
    export function createListFromArray(dataSource: string[], isSingleLevel?: boolean): HTMLElement {
        let subChild: HTMLElement[] = [];

        let generateList: Function = isSingleLevel ? generateSingleLevelLI : generateLI;

        for (let i: number = 0; i < dataSource.length; i++) {

            let li: HTMLElement = generateList(<string>dataSource[i], isSingleLevel ? <string>dataSource[i] : null);

            subChild.push(li);
        }

        return generateUL(subChild);
    }

    /**
     * Function helps to created an element list based on array of JSON input .
     * @param  {{[key:string]:Object}[]} dataSource - Specifies an array of JSON data.
     * @param  {ListBaseOptions} options? - Specifies the list options that need to provide.
     */
    export function createListFromJson(
        dataSource: { [key: string]: Object }[],
        options?: ListBaseOptions, level: number = 0, isSingleLevel?: boolean): HTMLElement {

        let curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);

        let fields: FieldsMapping = extend({}, defaultMappedFields, curOpt.fields);

        let child: HTMLElement[] = [];
        let li: HTMLElement;

        for (let i: number = 0; i < dataSource.length; i++) {

            let curItem: { [key: string]: Object } = dataSource[i];

            let innerEle: HTMLElement[] = [];

            if (curOpt.showCheckBox) {
                innerEle.push(createElement('div', { className: cssClass.check }));
            }
            if (isSingleLevel === true) {
                if (curOpt.showIcon) {
                    innerEle.push(createElement('span', { className: cssClass.icon + ' ' + <string>curItem[fields.iconCss] }));
                }
                li = generateSingleLevelLI(
                    <string>curItem[fields.text],
                    <string>curItem[fields.value],
                    curOpt.itemClass,
                    innerEle,
                    (curItem.hasOwnProperty('isHeader') &&
                        (curItem as { isHeader: Object } & { [key: string]: Object }).isHeader) ? true : false);
            } else {
                li = generateLI(curItem, fields, curOpt.itemClass, innerEle, options);
                li.classList.add(cssClass.level + '-' + level);
                li.setAttribute('aria-level', level + '');
                if (fields.tooltip) {
                    li.setAttribute('title', <string>curItem[fields.tooltip]);
                }

                if (curItem.hasOwnProperty(fields.htmlAttributes) && curItem[fields.htmlAttributes]) {
                    attributes(li, <{ [key: string]: string }>curItem[fields.htmlAttributes]);
                }

                if (curItem.hasOwnProperty(fields.enabled) && curItem[fields.enabled] === false) {
                    li.classList.add(cssClass.disabled);
                }

                if (curItem.hasOwnProperty(fields.isVisible) && curItem[fields.isVisible] === false) {
                    li.style.display = 'none';
                }

                processSubChild(curItem, fields, dataSource, curOpt, li, level);

                if (curItem.hasOwnProperty(fields.imageUrl)) {
                    let attr: { [key: string]: string } = { src: <string>curItem[fields.imageUrl] };
                    if (curItem.hasOwnProperty(fields.imageUrl)) {
                        merge(attr, curItem[fields.imageAttributes]);
                    }
                    prepend([createElement('img', { className: cssClass.image, attrs: attr })], li.firstElementChild);
                }

                if (curOpt.showIcon && !curOpt.template) {
                    prepend(
                        [createElement('div', { className: cssClass.icon + ' ' + <string>curItem[fields.iconCss] })],
                        li.firstElementChild);
                }
            }
            child.push(li);
        }

        return generateUL(child, curOpt.listClass);
    }

    /**
     * Return the next or previous visible element.
     * @param  {Element[]|NodeList} elementArray - An element array to find next or previous element. 
     * @param  {Element} li - An element to find next or previous after this element.
     * @param  {boolean} isPrevious? - Specify when the need get previous element from array.
     */
    export function getSiblingLI(elementArray: Element[] | NodeList, element: Element, isPrevious?: boolean): Element {
        if (!elementArray || !elementArray.length) { return void 0; }
        let siblingLI: Element;
        let liIndex: number;
        let liCollections: Element[] = Array.prototype.slice.call(elementArray);
        if (element) {
            liIndex = indexOf(element, liCollections);
        } else {
            liIndex = (isPrevious === true ? liCollections.length : -1);
        }
        siblingLI = liCollections[liIndex + (isPrevious === true ? -1 : 1)];
        while (siblingLI && (!isVisible(siblingLI) || siblingLI.classList.contains(cssClass.disabled))) {
            liIndex = liIndex + (isPrevious === true ? -1 : 1);
            siblingLI = liCollections[liIndex];
        }
        return siblingLI;
    }

    /**
     * Return the index of the li element
     * @param  {Element} item - An element to find next or previous after this element.
     * @param  {Element[]|NodeList} elementArray - An element array to find index of given li. 
     */
    export function indexOf(item: Element, elementArray: Element[] | NodeList): number {
        if (!elementArray || !item) { return void 0; } else {
            let liCollections: Element[] = <Element[]>elementArray;
            liCollections = Array.prototype.slice.call(elementArray);
            return liCollections.indexOf(item);
        }
    }

    /**
     * Returns the grouped data from given dataSource.
     * @param  {{[key:string]:Object}[]} dataSource - The JSON data which is necessary to process.
     * @param  {FieldsMapping} fields - Fields that are mapped from the data source.
     * @param  {SortOrder='None'} sortOrder- Specifies final result sort order.
     */
    export function groupDataSource(
        dataSource: { [key: string]: Object }[],
        fields: FieldsMapping,
        sortOrder: SortOrder = 'None'): { [key: string]: Object }[] {

        let cusQuery: Query = new Query().group(fields.groupBy);

        // need to remove once sorting issues fixed in DataManager
        cusQuery = addSorting(sortOrder, 'key', cusQuery);

        let ds: { [key: string]: Object }[] = getDataSource(dataSource, cusQuery);
        dataSource = [];

        for (let j: number = 0; j < ds.length; j++) {
            let itemObj: { [key: string]: Object }[] = (ds[j] as { items: { [key: string]: Object }[] } & { [key: string]: Object }).items;
            let grpItem: { [key: string]: Object } = {};
            let hdr: string = 'isHeader';
            grpItem[fields.text] = (ds[j] as { key: string } & { [key: string]: Object }).key;
            grpItem[hdr] = true;
            grpItem.items = itemObj;
            dataSource.push(grpItem);
            for (let k: number = 0; k < itemObj.length; k++) {
                dataSource.push(itemObj[k]);
            }
        }
        return dataSource;
    }

    /**
     * Returns a sorted query object.
     * @param  {SortOrder} sortOrder - Specifies that sort order.
     * @param  {string} sortBy - Specifies sortBy fields.
     * @param  {Query=new Query()} query - Pass if any existing query.
     */
    export function addSorting(sortOrder: SortOrder, sortBy: string, query: Query = new Query()): Query {
        if (sortOrder === 'Ascending') {
            query.sortBy(sortBy, 'ascending', true);
        } else if (sortOrder === 'Descending') {
            query.sortBy(sortBy, 'descending', true);
        }
        return query;
    }


    /**
     * Return an array of JSON Data that processed based on queries. 
     * @param  {{[key:string]:Object}[]} dataSource - Specifies local JSON data source. 
     * @param  {Query} query - Specifies query that need to process.
     */
    export function getDataSource(dataSource: { [key: string]: Object }[], query: Query): { [key: string]: Object }[] {
        return <{ [key: string]: Object }[]>new DataManager(dataSource)
            .executeLocal(query);
    }
    /**
     * Created JSON data based the UL and LI element
     * @param  {HTMLElement|Element} element - UL element that need to convert as a JSON
     * @param  {ListBaseOptions} options? - Specifies listbase option for fields.
     */
    export function createJsonFromElement(
        element: HTMLElement | Element, options?: ListBaseOptions): { [key: string]: Object }[] {

        let curOpt: ListBaseOptions = extend({}, defaultListBaseOptions, options);
        let fields: FieldsMapping = curOpt.fields;

        let curEle: HTMLElement = <HTMLElement>element.cloneNode(true);
        let jsonAr: { [key: string]: {} }[] = [];

        curEle.classList.add('json-parent');
        let childs: HTMLElement[] = <HTMLElement[] & NodeListOf<HTMLElement>>curEle.querySelectorAll('.json-parent>li');
        curEle.classList.remove('json-parent');

        for (let i: number = 0; i < childs.length; i++) {
            let li: HTMLElement = childs[i];
            let ul: Element = li.querySelector('ul');
            let json: { [key: string]: {} } = {};
            json[fields.text] = li.firstChild.textContent;
            json[fields.id] = genUID();
            if (ul) {
                json[fields.child] = createJsonFromElement(ul, options);
            }
            jsonAr.push(json);
        }

        return jsonAr;

    }
    /**
     * Created UL element from content template.
     * @param  {string} template - that need to convert and generate li element.
     * @param  {{[key:string]:Object}[]} dataSource - Specifies local JSON data source. 
     * @param  {ListBaseOptions} options? - Specifies listbase option for fields.
     */
    export function renderContentTemplate(template: string, dataSource: { [key: string]: Object }[], fields?: FieldsMapping):
        HTMLElement {
        let ulElement: HTMLElement = createElement('ul', { className: cssClass.ul, attrs: { role: 'presentation' } });
        let compiledString: Function = compile(template);
        let liCollection: HTMLElement[] = [];
        for (let item of dataSource) {
            let isHeader: Object = (item as { isHeader: Object } & { [key: string]: Object }).isHeader;
            let li: HTMLElement = createElement('li', {
                className: isHeader ? cssClass.group : cssClass.li, attrs: { role: 'presentation' }
            });
            if (isHeader) {
                li.innerText = item[fields.text] as string;
            } else {
                li.innerHTML = compiledString(item);
                let value: string = item[fields.value] as string;
                li.setAttribute('data-value', value);
                li.setAttribute('role', 'option');
            }
            liCollection.push(li);
        }
        append(liCollection, ulElement);
        return ulElement;
    }
    /**
     * Created header items from group template.
     * @param  {string} template - that need to convert and generate li element.
     * @param  {{[key:string]:Object}[]} dataSource - Specifies local JSON data source.
     * @param  {FieldsMapping} fields - Specifies fields for mapping the dataSource.
     * @param  {Element[]} headerItems? - Specifies listbase header items.
     */
    export function renderGroupTemplate(
        groupTemplate: string, groupDataSource: { [key: string]: Object }[], fields: FieldsMapping, headerItems: Element[]):
        Element[] {
        let compiledString: Function = compile(groupTemplate);
        for (let header of headerItems) {
            header.innerHTML = compiledString({ text: header.textContent });
        }
        return headerItems;
    }

    function genUID(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    function processSubChild(
        curItem: { [key: string]: Object }, fields: FieldsMapping, ds: { [key: string]: Object }[],
        options: ListBaseOptions, element: HTMLElement, level: number): void {

        // Get SubList   
        let subDS: { [key: string]: Object }[] = <{ [key: string]: Object }[]>curItem[fields.child];
        let hasChildren: boolean = <boolean>curItem[fields.hasChildren];
        //Create Sub child
        if (!isUndefined(subDS)) {
            hasChildren = true;
            element.classList.add(cssClass.hasChild);
            if (options.processSubChild) {
                let subLi: HTMLElement = <HTMLElement>createListFromJson(subDS, options, ++level);
                element.appendChild(subLi);
            }
        }

        // Create expand and collapse node
        if (!!options.expandCollapse && hasChildren && !options.template) {
            prepend(
                [createElement('div', { className: 'e-icons ' + cssClass.collapsible })],
                element.querySelector('.' + cssClass.textContent));
        }
    }

    function generateSingleLevelLI(
        text: string, value?: string, className?: string, innerElements?: HTMLElement[], grpLI?: boolean):
        HTMLElement {
        let li: HTMLElement = createElement('li', {
            className: (grpLI === true ? cssClass.group : cssClass.li) + ' ' + className,
            attrs: { role: (grpLI === true ? 'group' : 'presentation') }
        });
        if (grpLI) {
            li.innerText = text;
        } else {
            li.setAttribute('data-value', value);
            li.setAttribute('role', 'option');
            if (innerElements) { append(innerElements, li); }
            li.appendChild(document.createTextNode(text));
        }
        return li;
    }

    /* tslint:disable:align */
    function generateLI(item: string | { [key: string]: Object }, fields: FieldsMapping, className?: string,
        innerElements?: HTMLElement[], options?: ListBaseOptions): HTMLElement {
        let text: string = <string>item;
        let uID: string;
        let grpLI: boolean;
        if (typeof item !== 'string') {
            text = <string>item[fields.text];
            uID = <string>item[fields.id];
            grpLI = (item.hasOwnProperty('isHeader') && (item as { isHeader: Object } & { [key: string]: Object }).isHeader)
                ? true : false;
        }
        let li: HTMLElement = createElement('li', {
            className: (grpLI === true ? cssClass.group : cssClass.li) + ' ' + className,
            attrs: { role: (grpLI === true ? 'group' : 'presentation') }
        });

        if (uID) {
            li.setAttribute('uID', uID);
        }

        if (grpLI && options && options.groupTemplate) {
            let compiledString: Function = compile(options.groupTemplate);
            li.innerHTML = compiledString(item);
        } else if (!grpLI && options && options.template) {
            let compiledString: Function = compile(options.template);
            li.innerHTML = compiledString(item);
        } else {
            let innerDiv: HTMLElement = createElement('div', { className: cssClass.textContent });

            if (!isUndefined(innerElements)) {
                append(innerElements, li);
            }

            innerDiv.appendChild(createElement('span', { className: cssClass.text, innerHTML: text, attrs: { role: 'list-item' } }));

            li.appendChild(innerDiv);
        }
        return li;
    }

    function generateUL(innerEle: HTMLElement[], className?: string): HTMLElement {

        let element: HTMLElement = createElement('ul', { className: cssClass.ul + ' ' + className, attrs: { role: 'presentation' } });

        append(innerEle, element);

        return element;
    }

}

export interface FieldsMapping {
    id?: string;
    text?: string;
    value?: string;
    isChecked?: string;
    isVisible?: string;
    enabled?: string;
    groupBy?: string;
    expanded?: string;
    iconCss?: string;
    child?: string;
    tooltip?: string;
    hasChildren?: string;
    htmlAttributes?: string;
    imageUrl?: string;
    imageAttributes?: string;
}

/**
 * Basic ListBase Options
 */
export interface ListBaseOptions {
    /**
     * Specifies that fields that mapped in dataSource
     */
    fields?: FieldsMapping;
    /**
     * Specifies to show checkBox
     */
    showCheckBox?: boolean;
    /**
     * Specifies to show icon
     */
    showIcon?: boolean;
    /**
     * Specifies to show collapsible icon
     */
    expandCollapse?: boolean;
    /**
     * Specifies when need to add additional UL list class
     */
    listClass?: string;
    /**
     * Specifies when need to add additional LI item class
     */
    itemClass?: string;
    /**
     * Enables when need process depth child processing.
     */
    processSubChild?: boolean;
    /**
     * Specifies the sort order
     */
    sortOrder?: SortOrder;
    /**
     * Specifies the item template
     */
    template?: string;
    /**
     * Specifies the group header template
     */
    groupTemplate?: string;
}
