# MagicPacketSSH
Licensed under the EUPL-1.2-or-later

MagicPacketSSH is a type of proxy, which allows for unusual SSH connection types.
This program acts like a proxy, which sends a magic packet to the MagicPacketSSH server. 
The MagicPacketSSH in turn checks if the Magic Packet is the same as in the server's configuration, and if it is, it sends the by default opposite packet back.
