/* eslint-disable no-extra-semi */
/* eslint-disable semi */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
const { nanoid } = require('nanoid');
const books = require('./books');

/** menyimpan buku */
const addBooksHandler = (request, h) => {
  // eslint-disable-next-line object-curly-newline
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading 
   } = request.payload;
  const id = nanoid(10);

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name || name === '' || name === null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const isFinished = (pageCount, readPage) => {
    if (pageCount === readPage) {
      return true;
    }
    return false;
  };
  const finished = isFinished(pageCount, readPage);

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      },
    });
    response.code(201)
    return response
  };
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  });
  response.code(200);
  return response
};

/** Menampilkan seluruh buku */
const getAllBooksHandler = () => ({
  status: 'success',
  data: {
      books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
      }))
  }

});

/** menampilkan detail buku */
const getByIdBooksHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((book) => book.id === bookId)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

/** mengubah data buku */
const editBooksHandler = (request, h) => {
  const { bookId } = request.params;
  const {
 name, year, author, summary, publisher, pageCount, readPage, reading 
} = request.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

/** menghapus buku */
const deleteBooksHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getByIdBooksHandler,
  editBooksHandler,
  deleteBooksHandler,
};
