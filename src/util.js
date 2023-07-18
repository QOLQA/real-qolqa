// solo es mxgraph
import mxgraph from "@aire-ux/mxgraph";


function factory(mxBasePath) {
  return mxgraph({
    mxLoadResources: false,
    mxForceIncludes: false,
    mxLoadStylesheets: true,
    mxResourceExtension: '.txt',
    mxProductionMode: true,
    mxBasePath: mxBasePath,
  });
}

const mx = factory('../../node_modules/@aire-ux/mxgraph/javascript/src');

export default mx;