import { merge, formatUnit } from '@syncfusion/ej2-base/util';
import {AnimationSettings,SelectEventArgs} from "./list-view";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FieldSettings
 */
export interface FieldSettingsModel {

    /**
     * Specifies ID field that mapped in dataSource

    /**
     * Specifies text field that mapped in dataSource

    /**
     * Specifies checked field that mapped in dataSource

    /**
     * Specifies visibility field that mapped in dataSource

    /**
     * Specifies enabled field that mapped in dataSource

    /**
     * Specifies icon css class field that mapped in dataSource

    /**
     * Specifies child dataSource field that mapped in dataSource

    /**
     * Specifies title text field that mapped in dataSource

    /**
     * Specifies category field that mapped in dataSource

    /**
     * Specifies sorting field that mapped in dataSource

    /**
     * Specifies list html attributes field that mapped in dataSource.

    /**
     * Specifies when need fetch specific table from remote data

}

/**
 * Interface for a class ListView
 */
export interface ListViewModel extends ComponentModel{

    /**
     * Specifies the CSS class name to be added.

    /**
     * Specifies the html attributes to be added.

    /**
     * Specifies whether the ListView is enable or not.

    /**
     * Contains the list of JSON data to generate ListView items.

    /**
     * Specifies the query that need to process remote dataSource.

    /**
     * Specifies the field settings to map keys from the dataSource.

    /**
     * Configure the animation that affect in sub list navigation.

    /**
     * Specifies the sort order to sort the dataSource.

    /**
     * Specifies whether the icon to be shown or not.

    /**
     * Specifies Header Title.

    /**
     * Specifies whether to show the header..

    /**
     * Specifies the element style height.

    /**
     * Specifies the element style width.

    /**
     * Specifies the item template.

    /**
     * Specifies the group header template.

    /**
     * Event triggers when we select the list item.

    /**
     * Event triggers before loading.

    /**
     * Event triggers before loading.

    /**
     * Event triggers when load fails.

}