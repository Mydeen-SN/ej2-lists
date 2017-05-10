import{ListView} from "./list-view";
import { DataManager, Query } from '@syncfusion/ej2-data';
import{ SortOrder} from "../common/list-base";
import{ ListViewEffect} from "./list-view";

export interface ListViewHelper {
	new(id: string | HTMLElement): BuilderProperties
 }


export interface  BuilderProperties {
	create(): ListView
	/**
	* Event triggers before loading.
	*/
	actionBegin(value:Function): BuilderProperties;
	/**
	* Event triggers before loading.
	*/
	actionComplete(value:Function): BuilderProperties;
	/**
	* Event triggers when load fails.
	*/
	actionFailure(value:Function): BuilderProperties;
	/**
	* Event triggers when we select the list item.
	*/
	select(value:Function): BuilderProperties;
	/**
	* Configure the animation that affect in sub list navigation.
	*/
	animation(value: (val:AnimationSettings) => void | Object): BuilderProperties;
	/**
	* Specifies the CSS class name to be added.
	*/
	cssClass(value:string): BuilderProperties;
	/**
	* Contains the list of JSON data to generate ListView items.
	*/
	dataSource(value:Object[]|DataManager): BuilderProperties;
	/**
	* Specifies whether the ListView is enable or not.
	*/
	enable(value:boolean): BuilderProperties;
	/**
	* Enable or disable persisting component's state between page reloads.
	*/
	enablePersistence(value:boolean): BuilderProperties;
	/**
	* Enable or disable rendering component in right to left direction.
	*/
	enableRtl(value:boolean): BuilderProperties;
	/**
	* Specifies the field settings to map keys from the dataSource.
	*/
	fields(value: (val:FieldSettingsModel) => void | Object): BuilderProperties;
	/**
	* Specifies the group header template.
	*/
	groupTemplate(value:string): BuilderProperties;
	/**
	* Specifies Header Title.
	*/
	headerTitle(value:string): BuilderProperties;
	/**
	* Specifies the element style height.
	*/
	height(value:number|string): BuilderProperties;
	/**
	* Specifies the html attributes to be added.
	*/
	htmlAttributes(value:Object): BuilderProperties;
	isDestroyed(value:boolean): BuilderProperties;
	localData(value:Object[]): BuilderProperties;
	/**
	* Overrides the global culture and localization value for this component.
	*/
	locale(value:string): BuilderProperties;
	/**
	* Specifies the query that need to process remote dataSource.
	*/
	query(value:Query): BuilderProperties;
	/**
	* Specifies whether to show the header..
	*/
	showHeader(value:boolean): BuilderProperties;
	/**
	* Specifies whether the icon to be shown or not.
	*/
	showIcon(value:boolean): BuilderProperties;
	/**
	* Specifies the sort order to sort the dataSource.
	*/
	sortOrder(value:SortOrder): BuilderProperties;
	/**
	* Specifies the item template.
	*/
	template(value:string): BuilderProperties;
	/**
	* Specifies the element style width.
	*/
	width(value:number|string): BuilderProperties;
}
export interface AnimationSettings {
	/**
	* Specifies time duration to transform object.
	*/
	duration(value:number): AnimationSettings;
	/**
	* Specifies easing effect applied while transform.
	*/
	easing(value:string): AnimationSettings;
	/**
	* Specifies effect that shown in sub list transform.
	*/
	effect(value:ListViewEffect): AnimationSettings;
}
export interface FieldSettingsModel {
	/**
	* Specifies child dataSource field that mapped in dataSource
	*/
	child(value:string): FieldSettingsModel;
	/**
	* Specifies enabled field that mapped in dataSource
	*/
	enabled(value:string): FieldSettingsModel;
	/**
	* Specifies category field that mapped in dataSource
	*/
	groupBy(value:string): FieldSettingsModel;
	/**
	* Specifies list html attributes field that mapped in dataSource.
	*/
	htmlAttributes(value:string): FieldSettingsModel;
	/**
	* Specifies icon css class field that mapped in dataSource
	*/
	iconCss(value:string): FieldSettingsModel;
	/**
	* Specifies ID field that mapped in dataSource
	*/
	id(value:string): FieldSettingsModel;
	/**
	* Specifies checked field that mapped in dataSource
	*/
	isChecked(value:string): FieldSettingsModel;
	/**
	* Specifies visibility field that mapped in dataSource
	*/
	isVisible(value:string): FieldSettingsModel;
	/**
	* Specifies sorting field that mapped in dataSource
	*/
	sortBy(value:string): FieldSettingsModel;
	/**
	* Specifies when need fetch specific table from remote data
	*/
	tableName(value:string): FieldSettingsModel;
	/**
	* Specifies text field that mapped in dataSource
	*/
	text(value:string): FieldSettingsModel;
	/**
	* Specifies title text field that mapped in dataSource
	*/
	tooltip(value:string): FieldSettingsModel;
}