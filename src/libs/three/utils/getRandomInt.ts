/*
 * @Descripttion: 
 * @version: 
 * @Author: Jhowe
 * @Date: 2020-09-21 10:29:38
 * @LastEditors: Jhowe
 * @LastEditTime: 2020-09-21 10:29:59
 */
export default (min:number, max:number):number => Math.floor(Math.random() * (max - min + 1)) + min
