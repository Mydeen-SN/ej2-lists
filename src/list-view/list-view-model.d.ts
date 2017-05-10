import { merge, formatUnit } from '@syncfusion/ej2-base/util';import { attributes, addClass, removeClass, createElement, prepend, closest } from '@syncfusion/ej2-base/dom';import { Component, EventHandler, BaseEventArgs, Property, Complex, Event, CreateBuilder } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty, KeyboardEvents } from '@syncfusion/ej2-base';import { KeyboardEventArgs, EmitType } from '@syncfusion/ej2-base';import { Animation, AnimationOptions, Effect, ripple, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { ListBase, ListBaseOptions, SortOrder } from '../common/list-base';import { ListViewHelper } from './list-view-builder';
import {AnimationSettings,SelectEventArgs} from "./list-view";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FieldSettings
 */
export interface FieldSettingsModel {

    /**
     * Specifies ID field that mapped in dataSource     */    id?: string;

    /**
     * Specifies text field that mapped in dataSource     */    text?: string;

    /**
     * Specifies checked field that mapped in dataSource     */    isChecked?: string;

    /**
     * Specifies visibility field that mapped in dataSource     */    isVisible?: string;

    /**
     * Specifies enabled field that mapped in dataSource     */    enabled?: string;

    /**
     * Specifies icon css class field that mapped in dataSource     */    iconCss?: string;

    /**
     * Specifies child dataSource field that mapped in dataSource     */    child?: string;

    /**
     * Specifies title text field that mapped in dataSource     */    tooltip?: string;

    /**
     * Specifies category field that mapped in dataSource     */    groupBy?: string;

    /**
     * Specifies sorting field that mapped in dataSource     */    sortBy?: string;

    /**
     * Specifies list html attributes field that mapped in dataSource.     */    htmlAttributes?: string;

    /**
     * Specifies when need fetch specific table from remote data     */    tableName?: string;

}

/**
 * Interface for a class ListView
 */
export interface ListViewModel extends ComponentModel{

    /**
     * Specifies the CSS class name to be added.     * @default null     */    cssClass?: string;

    /**
     * Specifies the html attributes to be added.     * @default {}     */    htmlAttributes?: { [key: string]: string; };

    /**
     * Specifies whether the ListView is enable or not.     * @default null     */    enable?: boolean;

    /**
     * Contains the list of JSON data to generate ListView items.     * @default []     */    dataSource?: { [key: string]: Object }[] | DataManager;

    /**
     * Specifies the query that need to process remote dataSource.     * @default      */    query?: Query;

    /**
     * Specifies the field settings to map keys from the dataSource.     * @default ListBase.defaultMappedFields     */    fields?: FieldSettingsModel;

    /**
     * Configure the animation that affect in sub list navigation.     * @default { effect: 'SlideLeft', duration: 400, easing: 'ease' }     */    animation?: AnimationSettings;

    /**
     * Specifies the sort order to sort the dataSource.     * @default 'None'     */    sortOrder?: SortOrder;

    /**
     * Specifies whether the icon to be shown or not.     * @default false     */    showIcon?: boolean;

    /**
     * Specifies Header Title.     * @default ""     */    headerTitle?: string;

    /**
     * Specifies whether to show the header..     * @default ""     */    showHeader?: boolean;

    /**
     * Specifies the element style height.     * @default ''     */    height?: number | string;

    /**
     * Specifies the element style width.     * @default ''     */    width?: number | string;

    /**
     * Specifies the item template.     * @default null     */    template?: string;

    /**
     * Specifies the group header template.     * @default null     */    groupTemplate?: string;

    /**
     * Event triggers when we select the list item.     * @event     */    select?: EmitType<SelectEventArgs>;

    /**
     * Event triggers before loading.     * @event     */    actionBegin?: EmitType<Object>;

    /**
     * Event triggers before loading.     * @event     */    actionComplete?: EmitType<Object>;

    /**
     * Event triggers when load fails.     * @event     */    actionFailure?: EmitType<Object>;

}