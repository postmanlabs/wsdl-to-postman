 const envelopeName =
   ':Envelope',
   bodyName =
   ':Body';

 class BFSSoapParametersHelper {

   Traverse(root, protocol = 'soap') {
     let traverseOrder = [],
       envelopeAndProtocol = protocol + envelopeName,
       bodyAndProtocol = protocol + bodyName,
       jObj = {},
       Q = [],
       S = new Set();
     Q.push(root);
     jObj[envelopeAndProtocol] = {};
     jObj[envelopeAndProtocol][bodyAndProtocol] = {}

     while (Q.length > 0) {
       let e = Q.shift();
       traverseOrder.push(e);
       if (!S.has(e)) {
         if (e.isComplex) {
           jObj[envelopeAndProtocol][bodyAndProtocol][e.name] = {};
           if (e.namespace) {
             jObj[envelopeAndProtocol][bodyAndProtocol][e.name]['@_xmlns'] = e.namespace;
           }
         }
         else {
           jObj[envelopeAndProtocol][bodyAndProtocol][e.name] = this.getValueExample(e.type)
         }
         S.add(e);
       }
       for (let childrenIndex = 0; childrenIndex < e.children.length; childrenIndex++) {
         let emp = e.children[childrenIndex];
         if (emp.isComplex) {
           jObj[envelopeAndProtocol][bodyAndProtocol][e.name][emp.name] = {}
         }
         else {
           jObj[envelopeAndProtocol][bodyAndProtocol][e.name][emp.name] = this.getValueExample(emp.type)
         }
         if (!S.has(emp)) {
           Q.push(emp);
           S.add(emp);
         }
       }
     }
     while (traverseOrder.length > 0) {
       let e = traverseOrder.shift();
       console.log(e);
     }
     return jObj;
   }

   getValueExample(type) {
     if (type === 'unsignedLong')
       return 500;
   }
 }


 module.exports = {
   BFSSoapParametersHelper
 };
