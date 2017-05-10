import { merge, formatUnit } from '@syncfusion/ej2-base/util';
import { attributes, addClass, removeClass, createElement, prepend, closest } from '@syncfusion/ej2-base/dom';
import { Component, EventHandler, BaseEventArgs, Property, Complex, Event, CreateBuilder } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty, KeyboardEvents } from '@syncfusion/ej2-base';
import { KeyboardEventArgs, EmitType } from '@syncfusion/ej2-base';
import { Animation, AnimationOptions, Effect, ripple, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { ListBase, ListBaseOptions, SortOrder } from '../common/list-base';
import { ListViewModel, FieldSettingsModel } from './list-view-model';
import { ListViewHelper } from './list-view-builder';
// Effect Configuration Effect[] =  [fromViewBackward,fromViewForward,toViewBackward,toviewForward];
const effectsConfig: { [key: string]: Effect[] } = {
    'None': [],
    'SlideLeft': ['SlideRightOut', 'SlideLeftOut', 'SlideLeftIn', 'SlideRightIn'],
    'SlideDown': ['SlideTopOut', 'SlideBottomOut', 'SlideBottomIn', 'SlideTopIn'],
    'Zoom': ['FadeOut', 'FadeZoomOut', 'FadeZoomIn', 'FadeIn'],
    'Fade': ['FadeOut', 'FadeOut', 'FadeIn', 'FadeIn']
};

const effectsRTLConfig: { [key: string]: Effect[] } = {
    'None': [],
    'SlideLeft': ['SlideLeftOut', 'SlideRightOut', 'SlideRightIn', 'SlideLeftIn'],
    'SlideDown': ['SlideBottomOut', 'SlideTopOut', 'SlideTopIn', 'SlideBottomIn'],
    'Zoom': ['FadeZoomOut', 'FadeOut', 'FadeIn', 'FadeZoomIn'],
    'Fade': ['FadeOut', 'FadeOut', 'FadeIn', 'FadeIn']
};

// don't use space in classnames 
const classNames: ClassNames = {
    root: 'e-listview',
    hover: 'e-hover',
    selected: 'e-active',
    parentItem: 'e-list-parent',
    listItem: 'e-list-item',
    listItemText: 'e-list-text',
    grpListItem: 'e-list-group-item',
    hasChild: 'e-has-child',
    view: 'e-view',
    header: 'e-header',
    headerText: 'e-headertext',
    text: 'e-text',
    disable: 'e-disabled',
    content: 'e-content',
    icon: 'e-icons',
    backIcon: 'e-icon-back'
};

export interface Fields {
    /**
     * Specifies ID field that mapped in dataSource
     */
    id?: string;
    /**
     * Specifies text field that mapped in dataSource
     */
    text?: string;
}

export class FieldSettings extends ChildProperty<FieldSettings> {

    /**
     * Specifies ID field that mapped in dataSource
     */
    @Property('id')
    public id: string;
    /**
     * Specifies text field that mapped in dataSource
     */
    @Property('text')
    public text: string;

    /**
     * Specifies checked field that mapped in dataSource
     */
    @Property('isChecked')
    public isChecked: string;
    /**
     * Specifies visibility field that mapped in dataSource
     */
    @Property('isVisible')
    public isVisible: string;
    /**
     * Specifies enabled field that mapped in dataSource
     */
    @Property('enabled')
    public enabled: string;
    /**
     * Specifies icon css class field that mapped in dataSource
     */
    @Property('iconCss')
    public iconCss: string;
    /**
     * Specifies child dataSource field that mapped in dataSource
     */
    @Property('child')
    public child: string;
    /**
     * Specifies title text field that mapped in dataSource
     */
    @Property('tooltip')
    public tooltip: string;

    /**
     * Specifies category field that mapped in dataSource
     */
    @Property('groupBy')
    public groupBy: string;

    /**
     * Specifies sorting field that mapped in dataSource
     */
    @Property('text')
    public sortBy: string;

    /**
     * Specifies list html attributes field that mapped in dataSource.
     */
    @Property('htmlAttributes')
    public htmlAttributes: string;
    /**
     * Specifies when need fetch specific table from remote data
     */
    @Property('tableName')
    public tableName: string;
}

/**
 * Animation configuration settings.
 */
export interface AnimationSettings {
    /**
     * Specifies effect that shown in sub list transform.
     */
    effect?: ListViewEffect;
    /**
     * Specifies time duration to transform object.
     */
    duration?: number;
    /**
     * Specifies easing effect applied while transform.
     */
    easing?: string;
}

/**
 * ListView animation effects
 */
export type ListViewEffect = 'None' | 'SlideLeft' | 'SlideDown' | 'Zoom' | 'Fade';


/**
 * Represents the EJ2 ListView control. 
 * ```html
 * <div id="listview">
 * <ul>
 * <li>Favorite</li>
 * <li>Documents</li>
 * <li>Downloads</li>
 * </ul>
 * </div>
 * ```
 * ```typescript
 *   var lvObj = new ListView({});
 *   lvObj.appendTo("#listview");
 * ```
 */
@NotifyPropertyChanges
export class ListView extends Component<HTMLElement> implements INotifyPropertyChanged {

    private ulElement: HTMLElement;
    private selectedLI: HTMLElement;
    private curUL: HTMLElement;
    private curDSLevel: string[] = [];
    private curViewDS: { [key: string]: Object }[] = [];
    private curDSJSON: { [key: string]: Object };
    public localData: { [key: string]: Object }[];
    private liCollection: HTMLElement[];
    private headerEle: HTMLElement;
    private contentContainer: HTMLElement;
    private selectedItems: SelectedItem;
    private keyboardModule: KeyboardEvents;
    private touchModule: Touch;
    private keyConfigs: { [key: string]: string } = {
        moveDown: 'downarrow',
        moveUp: 'uparrow',
        select: 'enter',
        back: 'backspace'
    };

    private listBaseOption: ListBaseOptions;
    private animateOptions: AnimationOptions = {};
    private rippleFn: Function;

    private aniObj: Animation = new Animation(this.animateOptions);
    /**
     * Specifies the CSS class name to be added.
     * @default null
     */
    @Property()
    public cssClass: string;

    /**
     * Specifies the html attributes to be added.
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };

    /**
     * Specifies whether the ListView is enable or not.
     * @default null
     */
    @Property(true)
    public enable: boolean;

    /**
     * Contains the list of JSON data to generate ListView items.
     * @default []
     */
    @Property([])
    public dataSource: { [key: string]: Object }[] | DataManager;

    /**
     * Specifies the query that need to process remote dataSource.
     * @default 
     */
    @Property()
    public query: Query;

    /**
     * Specifies the field settings to map keys from the dataSource.
     * @default ListBase.defaultMappedFields
     */
    @Complex<FieldSettingsModel>(ListBase.defaultMappedFields, FieldSettings)
    public fields: FieldSettingsModel;

    /**
     * Configure the animation that affect in sub list navigation.
     * @default { effect: 'SlideLeft', duration: 400, easing: 'ease' }
     */
    @Property<AnimationSettings>({ effect: 'SlideLeft', duration: 400, easing: 'ease' })
    public animation: AnimationSettings;

    /**
     * Specifies the sort order to sort the dataSource.
     * @default 'None'
     */
    @Property<SortOrder>('None')
    public sortOrder: SortOrder;

    /**
     * Specifies whether the icon to be shown or not.
     * @default false
     */
    @Property<boolean>(false)
    public showIcon: boolean;

    /**
     * Specifies Header Title.
     * @default ""
     */
    @Property<string>('')
    public headerTitle: string;

    /**
     * Specifies whether to show the header..
     * @default ""
     */
    @Property<boolean>(false)
    public showHeader: boolean;

    /**
     * Specifies the element style height.
     * @default ''
     */
    @Property('')
    public height: number | string;

    /**
     * Specifies the element style width.
     * @default ''
     */
    @Property('')
    public width: number | string;

    /**
     * Specifies the item template.
     * @default null
     */
    @Property(null)
    public template: string;

    /**
     * Specifies the group header template.
     * @default null
     */
    @Property(null)
    public groupTemplate: string;

    /**
     * Event triggers when we select the list item.
     * @event
     */
    @Event()
    public select: EmitType<SelectEventArgs>;

    /**
     * Event triggers before loading.
     * @event
     */
    @Event()
    public actionBegin: EmitType<Object>;

    /**
     * Event triggers before loading.
     * @event
     */
    @Event()
    public actionComplete: EmitType<Object>;

    /**
     * Event triggers when load fails.
     * @event
     */
    @Event()
    public actionFailure: EmitType<Object>;


    /**
     * Constructor for creating the widget
     */
    constructor(options?: ListViewModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    public onPropertyChanged(newProp: ListViewModel, oldProp: ListViewModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'htmlAttributes':
                    this.setHTMLAttribute();
                    break;
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
                case 'enable':
                    this.setEnable();
                    break;
                case 'width':
                case 'height':
                    this.setSize();
                    break;
                case 'enableRtl':
                    this.setEnableRTL();
                    break;
                case 'fields':
                    this.listBaseOption.fields = (this.fields as ListViewModel & { properties: Object }).properties;
                    this.reRender();
                    break;
                case 'headerTitle':
                    if (!this.curDSLevel.length) {
                        this.header(this.headerTitle, false);
                    }
                    break;
                case 'showHeader':
                    {
                        this.header(this.headerTitle, false);
                    }
                    break;
                case 'dataSource':
                    this.reRender();
                    break;
                case 'sortOrder':
                case 'showIcon':
                    this.listBaseOption.showIcon = this.showIcon;
                    this.curViewDS = this.getSubDS();
                    this.resetCurrentList();
                    break;
                default:
                    break;
            }
        }
    }

    // Model Changes 
    private setHTMLAttribute(): void {
        if (Object.keys(this.htmlAttributes).length) {
            attributes(this.element, this.htmlAttributes);
        }
    }

    private setCSSClass(oldCSSClass?: string): void {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
        if (oldCSSClass) {
            removeClass([this.element], oldCSSClass.split(' '));
        }
    }

    private setSize(): void {
        this.element.style.height = formatUnit(this.height);
        this.element.style.width = formatUnit(this.width);
    }

    private setEnable(): void {
        this.enableElement(this.element, this.enable);
    }

    private setEnableRTL(): void {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        } else {
            this.element.classList.remove('e-rtl');
        }
    }

    private enableElement(element: HTMLElement, isEnabled?: boolean): void {
        if (isEnabled) {
            element.classList.remove(classNames.disable);
        } else {
            element.classList.add(classNames.disable);
        }
    }

    //Suport Component Functions
    private header(text?: string, showBack?: boolean): void {
        if (this.headerEle === undefined && this.showHeader) {
            this.headerEle = createElement('div', { className: classNames.header });
            let innerHeaderEle: HTMLElement = createElement('span', { className: classNames.headerText, innerHTML: this.headerTitle });
            let textEle: HTMLElement = createElement('div', { className: classNames.text, innerHTML: innerHeaderEle.outerHTML });
            let hedBackButton: HTMLElement = createElement('div', {
                className: classNames.icon + ' ' + classNames.backIcon + ' e-but-back',
                attrs: { style: 'display:none;' }
            });
            this.headerEle.appendChild(hedBackButton);
            this.headerEle.appendChild(textEle);
            this.element.classList.add('e-has-header');
            prepend([this.headerEle], this.element);
        } else if (this.headerEle) {
            if (this.showHeader) {
                this.headerEle.style.display = '';
                let textEle: Element = this.headerEle.querySelector('.' + classNames.headerText);
                let hedBackButton: Element = this.headerEle.querySelector('.' + classNames.backIcon);
                textEle.innerHTML = text;
                if (showBack === true) {
                    (hedBackButton as HTMLElement).style.display = '';
                } else {
                    (hedBackButton as HTMLElement).style.display = 'none';
                }
            } else {
                this.headerEle.style.display = 'none';
            }
        }
    }

    // Animation Related Functions
    private switchView(fromView: HTMLElement, toView: HTMLElement, reverse?: boolean): void {
        if (fromView && toView) {
            let fPos: string = fromView.style.position;
            let overflow: string = (this.element.style.overflow !== 'hidden') ? this.element.style.overflow : '';

            fromView.style.position = 'absolute';
            fromView.classList.add('e-view');
            let anim: Effect[];
            let duration: number = this.animation.duration;
            if (this.animation.effect) {
                anim = (this.enableRtl ? effectsRTLConfig[this.animation.effect] : effectsConfig[this.animation.effect]);
            } else {
                let slideLeft: string = 'SlideLeft';
                let slideRight: string = 'SlideRight';
                anim = (this.enableRtl ? effectsRTLConfig[slideLeft] : effectsConfig[slideRight]);
                duration = 0;
            }
            this.element.style.overflow = 'hidden';
            this.aniObj.animate(fromView, {
                name: (reverse === true ? anim[0] : anim[1]),
                duration: duration,
                timingFunction: this.animation.easing,
                end: (model: AnimationOptions): void => {
                    fromView.style.display = 'none';
                    this.element.style.overflow = overflow;
                    fromView.style.position = fPos;
                    fromView.classList.remove('e-view');
                }
            });
            toView.style.display = '';
            this.aniObj.animate(toView, {
                name: (reverse === true ? anim[2] : anim[3]),
                duration: duration,
                timingFunction: this.animation.easing,
                end: (): void => {
                    this.trigger('actionComplete');
                }
            });
            this.curUL = toView;
        }
    }

    protected preRender(): void {
        this.listBaseOption = {
            template: this.template,
            groupTemplate: this.groupTemplate,
            expandCollapse: true, listClass: '',
            fields: (this.fields as ListViewModel & { properties: Object }).properties, sortOrder: this.sortOrder, showIcon: this.showIcon
        };
    }

    private clickHandler(e: MouseEvent): void {
        let target: Element = <Element>e.target;
        let classList: DOMTokenList = target.classList;
        if (classList.contains(classNames.backIcon) || classList.contains(classNames.headerText)) {
            this.back();
        } else {
            let li: HTMLElement = <HTMLElement>closest(target.parentNode, '.' + classNames.listItem);
            if (li === null) { li = <HTMLElement>target; }
            this.setSelectLI(li, e);
        }
    }

    private hoverHandler(e: MouseEvent): void {
        let curLi: HTMLElement = <HTMLElement>closest((<Element>e.target).parentNode, '.' + classNames.listItem);
        this.setHoverLI(curLi);
    }

    private leaveHandler(e: MouseEvent): void {
        this.removeHover();
    };

    private keyActionHandler(e: KeyboardEventArgs): void {
        e.preventDefault();
        switch (e.action) {
            case 'moveDown':
                this.hoverSiblingLI();
                break;
            case 'moveUp':
                this.hoverSiblingLI(true);
                break;
            case 'select':
                this.setSelectLI(this.curUL.querySelector('.' + classNames.hover), e);
                break;
            case 'back':
                this.back();
                break;
        }
    }

    private swipeActionHandler(e: SwipeEventArgs): void {
        if (e.swipeDirection === 'Right') {
            this.back();
        }
    }

    private wireEvents(): void {
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'mouseover', this.hoverHandler, this);
        EventHandler.add(this.element, 'mouseout', this.leaveHandler, this);
        this.keyboardModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs
            });
        this.touchModule = new Touch(this.element, { swipe: this.swipeActionHandler.bind(this) });
    }

    private unWireEvents(): void {
        EventHandler.remove(this.element, 'click', this.clickHandler);
        EventHandler.remove(this.element, 'mouseover', this.hoverHandler);
        EventHandler.remove(this.element, 'mouseout', this.leaveHandler);
        this.keyboardModule.destroy();
        this.touchModule.destroy();
    }

    private removeHover(): void {
        let hoverLI: Element = this.element.querySelector('.' + classNames.hover);
        if (hoverLI) { hoverLI.classList.remove(classNames.hover); }
    }

    private removeSelect(): void {
        let selectedLI: Element[] = <NodeListOf<Element> & Element[]>this.element.querySelectorAll('.' + classNames.selected);
        for (let ele of selectedLI) {
            ele.removeAttribute('aria-selected');
            if (ele.className !== '') {
                ele.classList.remove(classNames.selected);
            }
        }
    }

    private isValidLI(li: Element | HTMLElement): boolean {
        return (li && li.classList.contains(classNames.listItem)
            && !li.classList.contains(classNames.grpListItem)
            && !li.classList.contains(classNames.disable));
    }

    private setSelectLI(li: Element, e?: MouseEvent | KeyboardEvent): void {
        if (this.isValidLI(li)
            && !li.classList.contains(classNames.selected)
            && this.enable) {

            this.removeSelect();
            li.classList.add(classNames.selected);
            li.setAttribute('aria-selected', 'true');
            this.removeHover();
            let data: { [key: string]: Object } = this.getItemData(li);
            this.selectedItems = {
                item: li,
                text: <string>data[this.listBaseOption.fields.text],
                data: data
            };
            let eventArgs: Object = {};
            merge(eventArgs, this.selectedItems);
            if (e) {
                merge(eventArgs, { isInteracted: true, event: e });
            }
            this.trigger('select', eventArgs);
            this.selectedLI = <HTMLElement>li;
            this.renderSubList(li);
        }
    }

    private setHoverLI(li: Element): void {
        if (this.isValidLI(li) && !li.classList.contains(classNames.hover) && this.enable) {
            let lastLi: Element[] = <NodeListOf<Element> & Element[]>this.element.querySelectorAll('.' + classNames.hover);
            if (lastLi && lastLi.length) { removeClass(lastLi, classNames.hover); }
            if (!(li as Element).classList.contains(classNames.selected)) {
                (li as Element).classList.add(classNames.hover);
            }
        }
    }

    private hoverSiblingLI(prev?: boolean): void {
        let lastLi: Element = this.curUL.querySelector('.' + classNames.hover);
        let siblingLI: Element;
        if (!lastLi) { lastLi = this.curUL.querySelector('.' + classNames.selected); }
        if (lastLi) {
            siblingLI = ListBase.getSiblingLI(this.curUL.querySelectorAll('.' + classNames.listItem), lastLi, prev);
        } else {
            if (prev) {
                let curLIs: NodeListOf<Element> = this.curUL.querySelectorAll('.' + classNames.listItem);
                siblingLI = curLIs[curLIs.length - 1];
            } else {
                siblingLI = this.curUL.querySelector('.' + classNames.listItem);
            }
        }
        this.setHoverLI(siblingLI);
    }

    //Data Source Related Functions
    private getSubDS(): { [key: string]: Object }[] {
        let levelKeys: string[] = this.curDSLevel;
        if (levelKeys.length) {
            let ds: { [key: string]: Object }[] = <{ [key: string]: Object }[]>this.localData;
            for (let key of levelKeys) {
                this.curDSJSON = <{ [key: string]: Object }[] & { [key: string]: Object }>this.findItemFromDS(ds, { id: key });
                ds = this.curDSJSON ? <{ [key: string]: Object }[] & { [key: string]: Object }>this.curDSJSON[this.fields.child] : ds;
            }
            return ds;
        }
        return <{ [key: string]: Object }[]>this.localData;
    }

    private getItemData(li: Element | Fields): { [key: string]: Object } {
        let fields: Fields = this.getElementUID(li);
        let curDS: { [key: string]: Object }[] = <{ [key: string]: Object }[]>this.dataSource;
        return <{ [key: string]: Object }>this.findItemFromDS(curDS, fields);
    }

    private findItemFromDS(
        dataSource: { [key: string]: Object }[],
        fields: Fields, parent?: boolean): { [key: string]: Object }[] | { [key: string]: Object } {

        let resultJSON: { [key: string]: Object }[] | { [key: string]: Object };

        if (dataSource && dataSource.length && fields) {
            dataSource.some((data: { [key: string]: Object }) => {

                //(!(fid) || id === fid) && (!(ftext) || text === ftext) && (!!fid || !!ftext)
                if ((fields.id || fields.text) &&
                    (!fields.id || data[this.fields.id] === fields.id) &&
                    (!fields.text || data[this.fields.text] === fields.text)) {
                    resultJSON = (parent ? <{ [key: string]: Object }[] | { [key: string]: Object }>dataSource : data);
                } else if ((data as Object).hasOwnProperty(this.fields.child) && (data[this.fields.child] as Object[]).length) {
                    resultJSON = <{ [key: string]: Object } & { [key: string]: Object }[]>this.findItemFromDS(
                        <{ [key: string]: Object }[]>data[this.fields.child], fields, parent);
                }
                return !!resultJSON;
            });
        } else {
            resultJSON = <{ [key: string]: Object }[] & { [key: string]: Object }>dataSource;
        }

        return <{ [key: string]: Object }[] & { [key: string]: Object }>resultJSON;
    }

    private getQuery(): Query {
        let columns: string[] = [];
        let query: Query = (this.query ? this.query : new Query());
        if (!this.query) {
            for (let column of Object.keys((this.fields as ListViewModel & { properties: Object }).properties)) {
                if (column !== 'tableName' && !!((this.fields as { [key: string]: Object })[column]) &&
                    (this.fields as { [key: string]: Object })[column] !==
                    (ListBase.defaultMappedFields as { [key: string]: Object })[column]
                    && columns.indexOf((this.fields as { [key: string]: string })[column]) === -1) {

                    columns.push((this.fields as { [key: string]: string })[column]);

                }
            }
            query.select(columns);
            if ((this.fields as ListViewModel & { properties: Object }).properties.hasOwnProperty('tableName')) {
                query.from(this.fields.tableName);
            }
        }

        return query;
    }

    private setViewDataSource(
        dataSource: { [key: string]: Object }[] = <{ [key: string]: Object }[]>this.localData): void {

        if (dataSource && this.fields.groupBy) {
            this.curViewDS = ListBase.groupDataSource(dataSource, this.fields, this.sortOrder);
        } else if (dataSource && this.sortOrder !== 'None') {
            this.curViewDS = ListBase.getDataSource(dataSource, ListBase.addSorting(this.sortOrder, this.fields.sortBy));
        } else {
            this.curViewDS = dataSource;
        }
    }

    private isInAnimation(): boolean {
        return this.curUL.classList.contains('.e-animate');
    }

    private setLocalData(): void {
        this.trigger('actionBegin');
        if (this.dataSource instanceof DataManager) {
            (this.dataSource as DataManager).executeQuery(this.getQuery()).then((e: Object) => {
                if (this.isDestroyed) { return; }
                this.localData = (e as ResultData).result;
                this.renderList();
                this.trigger('actionComplete', e);
            }).catch((e: Object) => {
                if (this.isDestroyed) { return; }
                this.trigger('actionFailure', e);
            });
        } else if (!this.dataSource || !(<{ [key: string]: Object }[]>this.dataSource).length) {
            let ul: HTMLElement = <HTMLElement>this.element.querySelector('ul');
            if (ul) {
                ul.remove();
                this.setProperties({ dataSource: ListBase.createJsonFromElement(ul) }, true);
                this.localData = <{ [key: string]: Object }[]>this.dataSource;
                this.renderList();
                this.trigger('actionComplete', { data: this.localData });
            }
        } else {
            this.localData = <{ [key: string]: Object }[]>this.dataSource;
            this.renderList();
            this.trigger('actionComplete', { data: this.localData });
        }
    }

    private reRender(): void {
        this.element.innerHTML = '';
        this.curUL = this.headerEle = undefined;
        this.setLocalData();
        this.header();
        this.contentContainer = createElement('div', { className: classNames.content });
        this.element.appendChild(this.contentContainer);
        this.renderIntoDom(this.ulElement);
    }

    private resetCurrentList(): void {
        this.setViewDataSource(this.curViewDS);
        this.contentContainer.innerHTML = '';
        this.createList();
        this.renderIntoDom(this.curUL);
    }

    private createList(): void {
        this.ulElement = this.curUL = ListBase.createList(this.curViewDS, this.listBaseOption);
        this.liCollection = <HTMLElement[] & NodeListOf<Element>>this.curUL.querySelectorAll('.' + classNames.listItem);
    }

    private renderSubList(li: Element): void {
        let uID: string = li.getAttribute('uid');
        if (li.classList.contains(classNames.hasChild) && uID) {
            let ul: Element = closest(li.parentNode, '.' + classNames.parentItem);
            let ele: Element = this.element.querySelector('[pid=\'' + uID + '\']');
            this.curDSLevel.push(uID);
            this.setViewDataSource(this.getSubDS());
            if (!ele) {
                ele = <Element>ListBase.createListFromJson(this.curViewDS, this.listBaseOption, this.curDSLevel.length);
                ele.setAttribute('pID', <string>uID);
                (ele as HTMLElement).style.display = 'none';
                this.renderIntoDom(ele);
            }
            this.switchView(<HTMLElement>ul, <HTMLElement>ele);
            this.liCollection = <HTMLElement[] & NodeListOf<Element>>this.curUL.querySelectorAll('.' + classNames.listItem);
            this.header(<string>this.selectedItems.data[this.listBaseOption.fields.text], true);
            this.selectedLI = undefined;
        }
    }

    private renderIntoDom(ele: Element): void {
        this.contentContainer.appendChild(ele);
    }

    private renderList(): void {
        this.setViewDataSource();
        this.createList();
        this.contentContainer = createElement('div', { className: classNames.content });
        this.element.appendChild(this.contentContainer);
        this.renderIntoDom(this.ulElement);
    }

    private getElementUID(obj: Fields | HTMLElement): Fields {
        let fields: Fields = {};
        if (obj instanceof Element) {
            fields.id = obj.getAttribute('uid');
        } else {
            fields = <Fields>obj;
        }
        return fields;
    }

    /**
     * To Initialize the control rendering
     */
    public render(): void {
        this.element.classList.add(classNames.root);
        attributes(this.element, { role: 'list' });
        this.setCSSClass();
        this.setEnableRTL();
        this.setEnable();
        this.setSize();
        this.wireEvents();
        this.header();
        this.setLocalData();
        this.setHTMLAttribute();
        this.rippleFn = ripple(this.element, '.e-list-item');
    }


    /**
     * To destroy the widget.
     */
    public destroy(): void {
        this.unWireEvents();
        let classAr: string[] = [classNames.root, this.cssClass, classNames.disable, 'e-rtl',
            'e-has-header'];
        removeClass([this.element], classAr);
        this.rippleFn();
        super.destroy();
    }

    /**
     * Function helps to switch back from navigated sub list.
     */
    public back(): void {
        let pID: string = this.curDSLevel[this.curDSLevel.length - 1];
        if (pID === undefined || this.isInAnimation()) { return; }
        this.curDSLevel.pop();
        this.setViewDataSource(this.getSubDS());
        let toUL: HTMLElement = <HTMLElement>this.element.querySelector('[uid=\'' + pID + '\']');
        let fromUL: HTMLElement = this.curUL;
        if (!toUL) {
            this.createList();
            this.renderIntoDom(this.ulElement);
            toUL = this.curUL;
        } else {
            toUL = toUL.parentElement;
        }
        let text: string = <string>this.curDSJSON[this.fields.text];
        this.switchView(fromUL, toUL, true);
        this.removeSelect();
        this.liCollection = <HTMLElement[] & NodeListOf<Element>>this.curUL.querySelectorAll('.' + classNames.listItem);
        this.header((this.curDSLevel.length ? text : this.headerTitle), (this.curDSLevel.length ? true : false));
    }

    /**
     * Function that used to select the list item based on an input.
     * @param  {Fields|HTMLElement} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public selectItem(obj: Fields | HTMLElement): void {
        let resultJSON: { [key: string]: Object }[] | { [key: string]: Object } = this.getItemData(obj);
        if (resultJSON) {
            let li: Element = this.element.querySelector('[uid="' + (<{ [key: string]: Object }>resultJSON)[this.fields.id] + '"]');
            if (li) { this.setSelectLI(li); }
        }
    }

    /**
     * Function returns currently selected item details
     */
    public getSelectedItem(): SelectedItem {
        return this.selectedItems;
    }

    /**
     * Function returns item details based on given input.
     * @param  {Fields|HTMLElement} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public findItem(fields: Fields): SelectedItem {
        return <SelectedItem & { [key: string]: Object }>this.findItemFromDS(<{ [key: string]: Object }[]>this.dataSource, fields);
    }

    /**
     * A function that used to enable the disabled list items based on given input.
     * @param  {Fields|HTMLElement} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public enableItem(obj: Fields | HTMLElement): void {
        let resultJSON: { [key: string]: Object } = this.getItemData(obj);

        if (resultJSON) {
            let li: Element = this.element.querySelector('[uid="' + resultJSON[this.fields.id] + '"]');
            if (li) { li.classList.remove(classNames.disable); }
            delete resultJSON[this.fields.enabled];
        }

    }

    /**
     * A function that used to disable the list items based on given input.
     * @param  {Fields|HTMLElement} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public disableItem(obj: Fields | HTMLElement): void {
        let resultJSON: { [key: string]: Object } = this.getItemData(obj);

        if (resultJSON) {
            let li: Element = this.element.querySelector('[uid="' + resultJSON[this.fields.id] + '"]');
            if (li) { li.classList.add(classNames.disable); }
            resultJSON[this.fields.enabled] = false;
        }
    }

    /**
     * A function helps to show an items based on given input. 
     * @param  {Fields|HTMLElement} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public showItem(obj: Fields | HTMLElement): void {
        this.showHideItem(obj, false, '');
    }

    /**
     * A function helps to hide an items based on given input.
     * @param  {Fields|HTMLElement} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public hideItem(obj: Fields | HTMLElement): void {
        this.showHideItem(obj, true, 'none');
    }

    private showHideItem(obj: Fields | HTMLElement, isHide: boolean, display: string): void {
        let resultJSON: { [key: string]: Object } = this.getItemData(obj);
        if (resultJSON) {
            let li: HTMLElement = <HTMLElement>this.element.querySelector('[uid="' + resultJSON[this.fields.id] + '"]');
            if (li) { li.style.display = display; }
            if (isHide) {
                resultJSON[this.fields.isVisible] = false;
            } else {
                delete resultJSON[this.fields.isVisible];
            }
        }
    }

    /**
     * Function to add new item to current view list.
     * @param  {{[key:string]:Object}[]} data - Array JSON Data that need to add.
     * @param  {Fields} fields - Fields as an Object with ID and Text fields.
     */
    public addItem(data: { [key: string]: Object }[], fields: Fields): void {
        let ds: { [key: string]: Object } = <{ [key: string]: Object }>this.findItemFromDS(
            <{ [key: string]: Object }[]>this.dataSource, fields);
        let child: { [key: string]: Object }[] = <{ [key: string]: Object }[]>ds[this.fields.child];
        if (!child) {
            child = [];
        }
        child = child.concat(data);
        if (ds instanceof Array) {
            this.dataSource = this.localData = <{ [key: string]: Object }[]>(ds as Object[] & { [key: string]: Object }).concat(data);
            this.setViewDataSource();
        } else {
            ds[this.fields.child] = child;
        }
        this.resetCurrentList();
    }

    /**
     * A function that removes the item from data source based on given input.
     * @param  {Fields|HTMLElement} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public removeItem(obj: Element | Fields): void {
        let fields: Fields = this.getElementUID(obj);
        let curDS: Object[] | Object = this.findItemFromDS(<{ [key: string]: Object }[]>this.dataSource, fields, true);
        if (curDS && obj) {
            let curAr: Object[];
            let idx: number;
            (curDS as Object[]).some((data: { [key: string]: Object }, index: number, arr: Object[]): boolean => {
                if ((fields.id || fields.text) &&
                    (!fields.id || data[this.fields.id] === fields.id) &&
                    (!fields.text || data[this.fields.text] === fields.text)) {
                    curAr = arr;
                    idx = index;
                    return true;
                }
                return false;
            });
            curAr.splice(idx, 1);
            this.resetCurrentList();
        }
    }

    // Module Required function
    protected getModuleName(): string {
        return 'listview';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     */
    protected getPersistData(): string {
        return this.addOnPersist(['cssClass', 'enableRtl', 'htmlAttributes',
            'enable', 'fields', 'animation', 'headerTitle',
            'sortOrder', 'showIcon', 'height', 'width']);
    }

}

interface ResultData {
    result: { [key: string]: Object }[];
}

interface ClassNames {
    root: string;
    hover: string;
    selected: string;
    parentItem: string;
    listItem: string;
    hasChild: string;
    view: string;
    header: string;
    text: string;
    headerText: string;
    listItemText: string;
    grpListItem: string;
    disable: string;
    content: string;
    backIcon: string;
    icon: string;
}

export interface SelectedItem {

    /**
     * Selected Item text.
     */
    text: string;

    /**
     * Selected Item list element.
     */
    item: HTMLElement | Element;

    /**
     * Selected Item dataSource JSON object.
     */
    data: { [key: string]: Object };
}

export interface SelectEventArgs extends BaseEventArgs, SelectedItem {
    /**
     * Specifies that event has triggered by user interaction.
     */
    isInteracted: boolean;
    /**
     * Specifies that event argument when event raised by other event.
     */
    event: MouseEvent | KeyboardEvent;
}

export let listViewBuilder: ListViewHelper = <ListViewHelper>CreateBuilder(ListView);