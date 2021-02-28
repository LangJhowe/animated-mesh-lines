/*
 * @Descripttion: 
 * @version: 
 * @Author: Jhowe
 * @Date: 2020-09-21 10:28:12
 * @LastEditors: Jhowe
 * @LastEditTime: 2020-09-21 10:28:42
 */
import getRandomInt from './getRandomInt'

export default function (arr:Array<any>): any {
  return arr[getRandomInt(0, arr.length - 1)]
}
