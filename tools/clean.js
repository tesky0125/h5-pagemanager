/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import del from 'del';
import fs from './lib/fs';

/**
 * Cleans up the output (build) directory.
 */
async function clean() {
  const debug = global.DEBUG;
  const delArr = debug ? ['demo/libs'] : ['.tmp', 'build/*', 'dist/*', '!dist/.git'];
  await del(delArr, {
    dot: true,
  });
}

export default clean;
