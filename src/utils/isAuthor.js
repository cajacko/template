// @flow

/**
 * Whether the current machine is the package authors machine
 *
 * @return {Boolean} The result of the check
 */
const isAuthor = () => __dirname.includes('charliejackson');

export default isAuthor;
