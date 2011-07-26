/*
   Copyright 2011, Lightbox Technologies, Inc

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

package com.lightboxtechnologies.spectrum;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.InputStreamReader;
import java.net.Socket;

import org.newsclub.net.unix.AFUNIXSocket;
import org.newsclub.net.unix.AFUNIXSocketAddress;

import com.lightboxtechnologies.io.IOUtils;

public class VMClient {

  public static void main(String[] args) throws Exception {

    if (args.length != 1) {
      throw new IllegalArgumentException("incorrect number of arguments");
    }

    final File socketFile = new File(args[0]);

    Socket sock = null;
    try {
      sock = AFUNIXSocket.newInstance();
      sock.connect(new AFUNIXSocketAddress(socketFile));

      DataInputStream in = null;
      try {
        in = new DataInputStream(sock.getInputStream());

        DataOutputStream out = null;
        try {
          out = new DataOutputStream(sock.getOutputStream());

          // send lines from stdin to the server
          BufferedReader stdin = null;
          try {
            stdin = new BufferedReader(new InputStreamReader(System.in));
   
            final byte[] buf = new byte[4096];
            String line;
            while ((line = stdin.readLine()) != null) {
              // parse command line into arguments
              
              // send length of command line
              out.writeLong(line.length()+1);

              // convert spaces to nulls
              // NB: This is an ugly hack. Split up your command line
              // arguments yourself. 
              final byte[] cmd = new byte[line.length()+1];
              System.arraycopy(line.getBytes(), 0, cmd, 0, line.length());
              for (int i = 0; i < cmd.length; ++i) {
                if (cmd[i] == ' ') cmd[i] = 0; 
              }
              cmd[cmd.length-1] = 0;

              // send the command line
              out.write(cmd);

              // send data length (zero, in our case)
              out.writeLong(0);

              boolean out_done = false, err_done = false;
              while (!out_done || !err_done) {
                // read file descriptor
                final int fd = in.readInt();

                // read length of block
                long len = in.readLong();

                // check whether one of the streams has ended
                if (len == 0) {
                  if (fd == 1) {      // stdout
                    out_done = true;
                    continue;
                  }
                  else if (fd == 2) { // stderr
                    err_done = true;
                    continue;
                  }
                }

                // read the data block
                int size;
                for ( ; len > 0; len -= size) {
                  size = (int) Math.min(buf.length, len);
                  in.readFully(buf, 0, size);
                  (fd == 1 ? System.out : System.err).write(buf, 0, size);
                }
              }
            }

            stdin.close();
          }
          finally {
            IOUtils.closeQuietly(stdin);
          }

          out.close();
        }
        finally {
        }

        in.close();
      }
      finally {
        IOUtils.closeQuietly(in);
      }

      sock.close();
    }
    finally {
      IOUtils.closeQuietly(sock);
    }
  }
}
