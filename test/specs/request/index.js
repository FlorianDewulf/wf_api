/* global describe it beforeEach afterEach */
import {expect} from 'chai'
import sinon from 'sinon'
import { request } from '../../../src/main'

/**
 * Test a successful XMLHttpRequest
 * @param {function} method The AJAX method
 * @param {function} done   The promise of the test
 */
function shouldWork (method, done) {
  let ajaxQuery = method('https://my.website.com', {}, (success) => {
    let response = JSON.parse(success.responseText)
    expect(response.success).to.be.equal(true)
    done()
  }, () => {})

  ajaxQuery.respond(200, JSON.stringify({}), JSON.stringify({ success: true }))
}

/**
 * Test a failed XMLHttpRequest
 * @param {function} method The AJAX method
 * @param {function} done   The promise of the test
 */
function shouldFail (method, done) {
  let ajaxQuery = method('https://my.website.com', {}, () => {
  }, (error) => {
    let response = JSON.parse(error.responseText)
    expect(response.success).to.be.equal(false)
    done()
  })

  ajaxQuery.respond(404, JSON.stringify({}), JSON.stringify({ success: false }))
}

describe('index file', () => {
  /**
   * Initialize the XMLHttpRequest simulation
   */
  beforeEach(function () {
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest()

    this.requests = []
    global.XMLHttpRequest.onCreate = function (xhr) {
      this.requests.push(xhr)
    }.bind(this)
  })

  /**
   * Clean XMLHttpRequest simulation
   */
  afterEach(function () {
    global.XMLHttpRequest.restore()
  })

  /**
   * Test the get
   */
  describe('test get', () => {
    it('should work', (done) => {
      shouldWork(request.get, done)
    })
    it('should fail', (done) => {
      shouldFail(request.get, done)
    })
  })
  /**
   * Test the post
   */
  describe('test post', () => {
    it('should work', (done) => {
      shouldWork(request.post, done)
    })
    it('should fail', (done) => {
      shouldFail(request.post, done)
    })
  })
  /**
   * Test the patch
   */
  describe('test patch', () => {
    it('should work', (done) => {
      shouldWork(request.patch, done)
    })
    it('should fail', (done) => {
      shouldFail(request.patch, done)
    })
  })
  /**
   * Test the put
   */
  describe('test put', () => {
    it('should work', (done) => {
      shouldWork(request.put, done)
    })
    it('should fail', (done) => {
      shouldFail(request.put, done)
    })
  })
  /**
   * Test the delete
   */
  describe('test delete', () => {
    it('should work', (done) => {
      shouldWork(request.delete, done)
    })
    it('should fail', (done) => {
      shouldFail(request.delete, done)
    })
  })
})
