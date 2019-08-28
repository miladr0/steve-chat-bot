

/**
 * Mongoose Aggregate Paginate
 * @param  {Aggregate} countResult
 * @param  {any} options
 * @param  {function} [callback]
 * @returns {Promise}
 */
function MessageAggregatePaginate(countResult, options, callback) {
  options = options || {};

  options.customLabels = options.customLabels ? options.customLabels : {};


  // Custom Labels
  const labelTotal = options.customLabels.totalDocs ? options.customLabels.totalDocs : 'totalDocs';
  const labelLimit = options.customLabels.limit ? options.customLabels.limit : 'limit';
  const labelPage = options.customLabels.page ? options.customLabels.page : 'page';
  const labelTotalPages = options.customLabels.totalPages ? options.customLabels.totalPages : 'totalPages';
  const labelDocs = options.customLabels.docs ? options.customLabels.docs : 'docs';
  const labelNextPage = options.customLabels.nextPage ? options.customLabels.nextPage : 'nextPage';
  const labelPrevPage = options.customLabels.prevPage ? options.customLabels.prevPage : 'prevPage';
  const labelHasNextPage = options.customLabels.hasNextPage ? options.customLabels.hasNextPage : 'hasNextPage';
  const labelHasPrevPage = options.customLabels.hasPrevPage ? options.customLabels.hasPrevPage : 'hasPrevPage';
  const labelPagingCounter = options.customLabels.pagingCounter ? options.customLabels.pagingCounter : 'pagingCounter';
  const page = parseInt(options.page || 1, 10);
  const limit = parseInt(options.limit || 10, 10);


  const count = countResult[0] ? countResult[0].count : 0;
  const pages = Math.ceil(count / limit) || 1;


  const result = {
    [labelTotal]: count,
    [labelLimit]: limit,
    [labelPage]: page,
    [labelTotalPages]: pages,
    [labelPagingCounter]: ((page - 1) * limit) + 1,
    [labelHasPrevPage]: false,
    [labelHasNextPage]: false,
  };

  // Set prev page
  if (page > 1) {
    result[labelHasPrevPage] = true;
    result[labelPrevPage] = (page - 1);
  } else {
    result[labelPrevPage] = null;
  }

  // Set next page
  if (page < pages) {
    result[labelHasNextPage] = true;
    result[labelNextPage] = (page + 1);
  } else {
    result[labelNextPage] = null;
  }

  return result;
}

module.exports = MessageAggregatePaginate;
