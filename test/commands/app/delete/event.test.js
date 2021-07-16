/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const fs = require('fs-extra')

const TheCommand = require('../../../../src/commands/app/delete/event')
const BaseCommand = require('../../../../src/BaseCommand')
const DeleteActionCommand = require('../../../../src/commands/app/delete/action')
jest.mock('../../../../src/commands/app/delete/action')

jest.mock('fs-extra')

jest.mock('yeoman-environment')

const yeoman = require('yeoman-environment')

const mockRegister = jest.fn()
const mockRun = jest.fn()
yeoman.createEnv.mockReturnValue({
  register: mockRegister,
  run: mockRun
})

beforeEach(() => {
  mockRegister.mockReset()
  mockRun.mockReset()
  yeoman.createEnv.mockClear()
  fs.ensureDirSync.mockClear()
  DeleteActionCommand.run = jest.fn()
})

describe('Command Prototype', () => {
  test('exports', async () => {
    expect(typeof TheCommand).toEqual('function')
    expect(TheCommand.prototype instanceof BaseCommand).toBeTruthy()
    expect(typeof TheCommand.flags).toBe('object')
  })
})

describe('passes flags through to delete action', () => {
  test('no flags', async () => {
    await TheCommand.run()
    expect(DeleteActionCommand.run).toHaveBeenCalled()
  })

  test('--yes', async () => {
    await expect(TheCommand.run(['--yes'])).rejects.toThrow('<event-action-name> must also be provided')
    expect(DeleteActionCommand.run).not.toHaveBeenCalled()
  })

  test('--yes, <event-action-name>', async () => {
    await TheCommand.run(['--yes', 'event-action-name'])
    expect(DeleteActionCommand.run).toHaveBeenCalledWith(['event-action-name', '--yes'])
  })
})

// Question? What is the actual difference between this call and `delete action`?
// Are event-actions somehow special?
// How can we detect the diff? -jm

// describe('good flags', () => {
//   test('fakeActionName --yes', async () => {
//     await TheCommand.run(['fakeActionName', '--yes'])

//     expect(yeoman.createEnv).toHaveBeenCalled()
//     expect(mockRegister).toHaveBeenCalledTimes(1)
//     const genName = mockRegister.mock.calls[0][1]
//     expect(mockRun).toHaveBeenCalledWith(genName, {
//       'skip-prompt': true,
//       'action-name': 'fakeActionName'
//     })
//   })

//   test('fakeActionName', async () => {
//     await TheCommand.run(['fakeActionName'])

//     expect(yeoman.createEnv).toHaveBeenCalled()
//     expect(mockRegister).toHaveBeenCalledTimes(1)
//     const genName = mockRegister.mock.calls[0][1]
//     expect(mockRun).toHaveBeenCalledWith(genName, {
//       'skip-prompt': false,
//       'action-name': 'fakeActionName'
//     })
//   })
// })
