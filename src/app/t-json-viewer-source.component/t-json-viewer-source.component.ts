import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

interface ItemSource {
  key: string;
  value: any;
  title: string;
  type: string;
  isOpened: boolean;
}

@Component({
  selector: 't-json-viewer-source',
  templateUrl: './t-json-viewer-source.component.html',
  styleUrls: ['./t-json-viewer-source.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TJsonViewerSourceComponent implements OnInit {

  @Input()
  json: Array<any>|Object|any;

  @Output()
  onCollapse :EventEmitter<any> = new EventEmitter();
       
  private assetSource: Array<ItemSource> = [];
  class;

  constructor() { }

  ngOnInit() {
    // Do nothing without data
    if (!_.isObject(this.json) && !_.isArray(this.json)) {
      return;
    }

   // this.class = "item__title";

    /**
     * Convert json to array of items
     */
    Object.keys(this.json).forEach((key) => {
      this.assetSource.push(this.createItem(key, this.json[key]));
      //console.log(this.assetSource);
    });
  }

  /**
   * Check value and Create item object
   * @param {string|any} key
   * @param {any} value
   */
  private createItem(key, value): ItemSource {
    let item: ItemSource = {
      key: key || '""', // original key or empty string
      value: value, // original value
      title: value, // title by default
      type: undefined,
      isOpened: false // closed by default
    };

    if (_.isString(item.value)) {
      item.type = 'string';
      item.title = `"${item.value}"`;
    }

    else if (_.isNumber(item.value)) {
      item.type = 'number';
    }

    else if (_.isBoolean(item.value)) {
      item.type = 'boolean';
    }

    else if (_.isDate(item.value)) {
      item.type = 'date';
    }

    else if (_.isFunction(item.value)) {
      item.type = 'function';
    }

    else if (_.isArray(item.value)) {
      item.type = 'array';
      // item.title = `Array[${item.value.length}] ${JSON.stringify(item.value)}`;
      item.title = `Array[ ${item.value.length} ]`;
    }

    else if (_.isObject(item.value)) {
      item.type = 'object';
      // item.title = `Object ${JSON.stringify(item.value)}`;
      item.title = `Object { } `;
    }

    else if (item.value === null) {
      item.type = 'null';
      item.title = 'null'
    }

    else if (item.value === undefined) {
      item.type = 'undefined';
      item.title = 'undefined'
    }

    item.title = '' + item.title; // defined type or 'undefined'

    return item;
  }

  
  /**
   * Check item's type for Array or Object
   * @param {ItemSource} item
   * @return {boolean}
   */
  isObject(item: ItemSource): boolean {
    return ['object', 'array'].indexOf(item.type) !== -1;
  }
  
  /**
   * Handle click event on collapsable item
   * @param {ItemSource} item
   */
  //  fireCollapseEvent(e) {
  //     this.onCollapse.emit(e);
  //  }

  clickHandle(item: ItemSource) {
    if (!this.isObject(item)) {
      return;
    }

    this.onCollapse.emit(item);
    item.isOpened = !item.isOpened;

  }

  clickHandleSub(item: ItemSource) {
    this.onCollapse.emit(item);
  }

  onMouseOver()  {
    this.class = "item__type--null item__value";
  }

  onMouseOut() {
     this.class = "item__title";
  }

}
