# <h1 id="cisco_routing">Cisco Routing</h1>
## Tables
Link State | Type | Description
- | - | -
LSA 1 |Router | One per router, per area <br/>Lists RID & all interfaces in that area</br>Flooded only in that area | 
LSA 2 |Network | One per transit network</br>Created by DR in the subnet</br>Represent the subnet fa all the interfaces in it</br>Flooded only in that area | 
LSA 3 |Network Summary </br> (external area route)| Created by ABR Represents: Networks in an area when being advertised into another area</br>Defines the Subnets in the origin area and their costs</br>Does not define the topology of the origin area</br>Flooded only within its area of the origin. Re-originated on ABR |
LSA 4 | ASBR Summary | Created by ABR Advertises a host route to reach an</br>ASBR Contains ABSR's RID and ABR's cost to reach it</br>Flooded only within its area of the origin Re-originated on ABRs |
LSA 5 |AS Route </br> (external AS route) | Created by ASBR for external routes injected into OSPF Flooded to all areas |
LSA 6 |Group Membership (MOSPF) |
LSA 7 |NSSA External | Created by ASBR inside NSSA</br>External route information carried in this type LSA to distinguish from LSA Type 5 which is still prohibited in NSSA</br>ABR with the highest RID will translate to LSA type 5 and inject the external routes to other area |

Area | Description | Features 
- | -
Normal | 1,2,3,4,5 ||
Stub | 1,2,3 | Has 0.0.0.0 route |
Totally Stub | 1,2 | No 0.0.0.0 route, just a default route|
Not-So-Stubby Area | 1,2,3,7 ||
Totally Not-So-Stubby Area | 1,2,7 ||

OSPF States | Description |
- | - |
DOWN | No OSPF Neighbors Detected |
ATTEMPT/INIT | One router sent a hello packet. The other is yet to respond. Seen in one way. |
2-WAY | Both routers SEEN each other's packet. Incoming Hello has it's own Router ID. |
EXSTART | Decide on Master-Slave on who initiates communication of Database Descriptor Packets (DBD) |
EXCHANGE | Actually exchanging DBD packets. Also Link State Requests & Link State Advertisements are sent here, which determines if full Link State Updates should be sent. |
LOADING | Link State Updates are sent |
FULL | The Databases are synchronized fully |

OSPF Interface Types | Description | 
- | - |
Notes | Point = NO DR & BDR</br>Multiaccess = More than one network device</br>Broadcast = Automatic Neighbors<br>Non-Broadcast = Manual Neighbor Configuration |
Point-To-Point | No DR & BDR</br>POINT means NO DR-BDR|
Broadcast | Multiaccess is when there's multiple points, with a switch coordinating this.</br>Has a DR |
Non-Broadcast | Hub & Spoke</br> Still Multiaccess because it has multiple points|
Non-Broadcast Multi-Access | DIDN'T EXIST IN GNS3</br>Frame Relay & ATM & X.25 fit this criteria</br>Manually define neighbors</br>It emulates broadcast |
Point-To-Multipoint | Organizes many point-to-point networks</br>NO DR-BDR</br>I guess this dynamically finds neighbors, huh </br>Turns a MULTICAST NETWORK into a collection of point-to-point networksPstatus7  |
Point-To-Multipoint Non-Broadcast | Manually define neighbors with NO DR-BDR</br>Non-Broadcast necessitates the static configuration of neighbors |

Protocol | Administrative Distance |
- | - |
External BGP | 20 |
Internal EIGRP | 90 |
IGRP | 100 |
OSPF | 110 |
Intermediate System-to-Intermediate System (IS-IS) | 115 |
Routing Information Protocol (RIP) | 120 |
External EIGRP | 170
Internal BGP | 200 |

EIGRP Metrics |
- |
Bandwidth |
Load |
Delay (K3) |
Reliability |
MTU |

Feasibility Definitions | Description |
- | - |
Feasible Distance | Total metric between source router and destination. Including first hop, including reported/advertised distance. |
Reported Distance & Advertised Distance | Feasible (aka total/entire) metric MINUS the first hop to the router ahead|
Conversely, this means the first hop would be the feasible distance minus reported/advertised distance
Successor | The BEST route to a destination |
Feasible Successor | Route in reserve! Feasible means something different in this context. Feasible means shittier when talking about routes/successors.</br>With distance, feasible means better. |
Feasibility Condition | LOOK AT THE REPORTED DISTANCE (2nd value) OF ALL THE ROUTES IN EIGRP ALL LINKS.</br> If the Reported Distance of candidate routes is smaller than the feasible (total) distance of the current successor route, then it counts, because the cost would be is smaller (better)! |
If reported distance of candidate routes is SMALLER than total successor, it counts. 


BGP Best Path Algorithm | Ranking | What's Better | Direction | Description |
- | - | - | - | - |
Weight |1| Highest | Local | Cisco Proprietary </br> |
Local Preference |2| Highest | In | Choose outbound external path. It flows into all internal routers
Locally Originated |3| | | If two BGP routes are there and one is from our own router & the other is remote, favor the one coming from our own router listed as 0.0.0.0 as next-hop </br>More favored going down -> (default-originate, default-information originate, network, redistribute, aggregate-address) |
AS Path |4| | | Easy Peasy |
Origin Code |5| | | If route from far away was learned by an IGP (Interior Gateway Protocol), then favor it over redistributed routes far away routes that were learned by redistribution) </br> IGP, EGP, and Incomplete.</br> Respectively, those are i, e, and ?. "i" is IGP, "e" is EGP (precursor to BGP never used), "?" is incomplete</br>You will never see the "e" code</br>"?" can mean BGP because it doesn't fit under "i" & "e"</br>When you do a Network command in BGP, the code is if the "route" in BGP network command first came from IGP or BGP or whatever</br>Again, you'll never see "e". Only "i" & "?"|
MED |6| Lower | Out |The MED value is sent to the ISP to possibly influence the ISP as to which router in the internal enterprise to send it's packets  |
eBGP vs iBGP  | 7 | | | This is TYPE of BGP.... NOT IGP vs redistributed/incomplete, that would be 5. |
BGP Multipath | 8 | | |
Oldest Route | 9 | | |

BGP States | Description
- | -
Idle | BGP resources are initialized by the router. BGP inbound connection attempts are refused. BGP initiates a TCP connection to the peer. |
Connect | You're in middle of 3 way handshake |
Active | Not a good place to be. Waiting too long for 3 way handshake |
OpenSent | OPEN message is sent, and is waiting to hear back |
OpenConfirm | OPEN message is received, now sending keepalive |
Established | Both peers exchange UPDATE messages. If there is an error within any of the UPDATE messages, the BGP peer will send a NOTIFICATION message and enter the Idle state.


DMVPN Registration | Description |
- | - |
NHRP Registration | Private IP -> Public IP</br>Private IP (overlay), Public IP (underlay)</br>A client signs up with a Hub's mapping table of Tunnel IP (Private) and NBMA Service Provider (Public IPS). |
NHRP Resolution | Private IP -> Public IP</br>A client sends the Private IP of the next hop and gets the Public IP |

DMVPN Phases | Description |
- | - |
Phase 1 | Everything just goes through the Hub, simple as that. The hub will always be listed as the Next Hop for remote spokes.
Phase 2 | The Next Hop of the remote spoke will not be through the Hub, but will go through the Private IP address of the Tunnel of the other spoke.</br> It needs more information than the Private IP (such as the Public NBMA address).</br>NHRP Resolution goes from Spoke to Hub, then Hub to Remote Spoke, then Remote Spoke to our Spoke (a circle), with the Public IP. Then it doesn't have to go through the Hub again to get the public address to do the DMVPN ping to remote spoke. </br>NOTE. To do Phase II, you configure multipoint GRE on all hub-and-spoke tunnel interfaces.</br>The traffic goes through the hub until an IPsec tunnel has been formed between the two communicating spokes. 
Phase 3 | "ip nhrp redirect" on hub.</br> "ip nhrp shortcut" on spokes. </br> The first IP packet from the spoke goes into the hub, because the hub is the default route (not the spoke in Phase II).</br>Routing tables have DEFAULT ROUTES (THINNER ROUTE TABLES) and still spoke to spoke communication. Next Hop Route always Hub</br>YOU DON'T NEED THE FULL ROUTING TABLE OF ALL SPOKES!!!!!!! THE HUB WILL HELP WITH THE PARTICULAR SPOKES YOU WANT ON AN "AS NEEDED" BASIS, VIA NHRP REDIRECTS. I'm guessing the rest is summarized.


IPV6 Addresses | Address |
- | - |
EUI | Put in FFFE in middle of MAC address, flip 7th bit |
Global Unicast | 2000::/3 |
Link Local | FE80::/10 |
Loopback | ::1/128 |
Multicast | FF00::/8 |
Solicited Node | FF02::1:FF00:0000/104 |
Unique Local | FC00::/7 |
Unspecified | ::/128 |

Hello Timers Again | Time |
- | - |
OSPF Hello Timer | 10 |
EIGRP Hello Timer | 5 |
RIP Update Timer | 30 |
BGP Keepalive Timer | 60 |
HSRP Hello Timer | 3 |
GLBP Hello Timer | 3 |
BPDU Hello Timer | 2 |

Timers | Time |
- | - |
OSPF Hello Timer | 10 |
OSPF Dead Timer | 40 |
EIGRP Hello Timer | 5 |
EIGRP Dead Timer | 15 |
EIGRP Hello Timer (low speed) | 60 |
EIGRP Hello Timer (high speed) | 180 |
RIP Update Timer | 30 |
RIP Invalid Timer | 180 |
RIP Holddown Timer | 180 |
RIP Flush Timer | 240 |
BGP Keepalive Timer | 60 |
BGP Hold Timer | 6 |
HSRP Hello Timer | 3 |
HSRP Hold Timer | 10 |
GLBP Hello Timer | 3 |
GLBP Hold Timer | 10 |
CDP Timer | 60 |
BPDU Hello Timer | 2 |
BPDU Listening Timer | 15 |
BPDU Learning Timer | 15 |
BPDU Max Age Blocking Timer | 20 |

Multicast | Time |
- | - |
OSPF (all OSPF routers) | 224.0.0.5 |
OSPF (all DR's/BDR's) | 224.0.0.6 |
RIP | 224.0.0.9 |
EIGRP | 224.0.0.10 |
VRRP | 224.0.0.18 |
GLBP | 224.0.0.102 |

Multicast Trees | Description
- | -	
Shortest-Path Tree (SPT)</br>Source Tree | Sender to Rendezvous Point	(S,G) |
Rendezvous-Point Tree (RPT)</br>Shared Tree | Rendezvous Point to Receiver (*,G) </br> The reason it is (*,G) state is because it is eagerly looking for interested senders. RP will indicate which ones. 


MPLS Tables | Definition |
- | - |
LDP | Routing Protocol that alerts everyone else on Labels |
TDP | Virtually the same as LDP |
LSR | Any router that exchanges Labels (All routers in domain) |
LIB | LIB & LFIB holds label information but LIB only gets information from regular (RIB) non-CEF routing table.</br> With the LIB, it sends it's labels to adjacent routers. |
LFIB | Label Forwarding Information Base</br> Filled by RIB/FIB/LIB. Remember, FIB is CEF table</br> The CEF counterpart to LIB</br> LFIB is to match an label to another outgoing label. It's strictly looking at labels.|
Push | Putting a label in the packet for the FIRST TIME |
Swap | Changing labels in the middle of MPLS domain |
Pop | Removing label at end |
Delete | Remove the whole header |

Data Center Models | Description |
- | - |
2000 | They are remote line cards that connect to the 5000, or 7000 or 9000 switches</br> Non Chassis Switches that can be 1U or 2U</br> It is REALLY only a set of extra ports that extends out, nothing more. A dumb box.</br> It says the reason for their existence is to put the main 5000/7000/9000 switch in the END OF THE ROW while having servers retain TOP OF RACK functionality to clean up the cabling setup. </br> Placed on Top of the rack |
5000 | Aggregation & Access & Storage switch | 
7000 | Nexus 7k supports OTV, LISP, MPLS and some other L3 things that 5k doesn't. </br> Core & Aggregation switch </br>Very neat looking with plastic doors & teal borders & gray door handles |
9000 | No doors, looks like a basement appliance/radiator. |

SD-WAN Conventions | Description |
- | - |
OMP | Protocol to push configuration |
vBond | On-boards the vEdge into the system. Connected to all devices |
vEdge | Router that gets policies from vSmart & OMP.  | Able to run routing protocol like OSPF, BGP to create connectivity on LAN side but also with MPLS provider if necessary. It establishes secure IPSec tunnels with others vEdges depending on selected topology. |
vManage | Dashboard |
vSmart | The "brains" that manages control & data policies for the vEdges via OMP |

### IPv4 Headers
IPV4 Header Field | Bits | Description |
- | - | - | 
Version | 4 | IP packet type. Value "4" means it's IPV4
Header Length | 4 | Header Length. Not the size of packet
DSCP | 8 | Differentiated Services Code Point. ECN (Explicit Congestion Notification) is the last 2 bits, depending of the use of ECN.
Total Length | 16 | The entire size of the packet, including header & data
- | -
Identification | 16 | If a packet is framgmented, this will identify the fragments
Flags | 3 | Bit 0 = Reserved as 0, Bit 1 = Don't Fragment (DF), Bit 2 = More Fragments (MF)
Fragment Offset | 13 | Indicates number of data bytes preceeding or ahead of the fragment.
- | -
Time To Live | 8 | Time To Live
Protocol | 8 | IP has lots of protocols. Specifies if it's something like EIGRP, BGP, OSPF, VRRP. Obviously, 256 different possibiltities.
Header Checksum | 16 | Error Checking a header.
- | -
Source Address | 32 | 
- | -
Destination Address | 32 | 

### TCP Header
TCP Header Field | Bits | Description |
- | - | - | 
Source Port | 16 |
Destination Port | 16 |
- | - | - |
Sequence Number | 32 | Identifying a TCP Segment. This is the identifying number for SYN/ACKS & Windowing
- | - | - |
Acknowledge Number | 32 | If the ACK flag is set then the value of this field is the next sequence number that the sender of the ACK is expecting. This acknowledges receipt of all prior bytes (if any). The first ACK sent by each end acknowledges the other end's initial sequence number itself, but no data.
- | - | - |
Data Offset (TCP Header Length) | 4 | Header Length of TCP measured in Quadwords.
Reserved | 3 | Set this to zero
Flags | 9 | NS - Not used much, Experimental to protect agaisnt malicious concealment from sender </br>CWR - Congestion Window Received</br>ECE - Allows Congestion Notification, depending on the SYN flag setting</br>URG - Urgent Pointer</br>ACK - Indicates that Acknowledge Pointer Field Is Significant</br>PSH - Push buffered data to the receiving application</br>RST - Reset Connection</br>SYN - Synchronize Sequence Numbers. Only the first packet sent from each end should have this flag set.</br>FIN - Last Packet from Sender</br>
Window Size | 16 | The size of the receive window, which specifies the number of window size units[c] that the sender of this segment is currently willing to receive.
- | - | - |
Header Checksum | 16 | Error checking for integrity
Urgent Pointer | 16 | If the URG flag is set, then this 16-bit field is an offset from the sequence number indicating the last urgent data byte.
Options | 0-320 | More flags
Padding | 32 | All zeroes indicating the packet had ended

Wireless Type (802.11) | Speed | Frequency | Notes |
- | - | - | - |
802.11b | 11 Mbps | 2.4 GHz | |
802.11a | 54 Mbps | 2.4 GHz | |
802.11g | 54 Mbps | 2.4 GHz | |
802.11n | 300 Mbps | 2.4 GHz - 5.0 GHz | |
802.11ac | 450 Mbps - 1300 Mbps | 2.4 GHz - 5.0 GHz | |



## Multicast
### Sparse Mode
### Config
(config)# ip pim rp-address 20.0.0.1
(config-if)# interface Ethernet3/2
(config-if)# ip pim sparse-mode
If you put access-list number after rp-address wildcard-mask, you can configure Auto-RP for redundancy as long as all interfaces are configured with multicast
### (S,G)
If a router has (S,G) state, that means that routers who use that multicast address (G) as destination will only pass if the source is S AND when it's coming from the incoming address in the "show ip mroute" table. It's different than traditional routing because traditional route tables have no condition for the source address.
https://blog.habets.se/2010/06/The-rules-of-multicast.html
It clearly shows that packets that come from 1.0.0.2 are only accepted when they come in on interface Fa1/1. 
(S,G) represents a route & a flow of traffic from sender to receiver
### (Star,G)
Doesn't care about the source at all. Any source. If the incoming interface says Null in "show ip mroute", the blog says it can still come from any interface. Remember this is to see which source routers are interested in sending to the group. You know which destination routers are interested to join particular groups due to IGMP Join messages.
### Steps
- Source sends PIM Register to RP.
- RP has (S,G) State
- If RP has no (*,G) from the Client, it sends PIM Stop message to Source. Multicast traffic will no longer send to RP and it will try again to register in 3 minutes.
- When the receiver is finally on the rendezvous point, the path to sender to RP finally gets it's (S,G) states with the OIL (outgoing interface) established. Those (S,G) states are particular routes to the receiver, for that multicast group/address.
- When the client/receiver knows the real source (aka doesn't need to put *,G), the client now makes another path that's quickest to sender, and fills those (S,G) & "OIL" in that optimal path. That means that RP was only good for letting client know what exact sources/senders were interested in that group.
- Client means the router next to the real client, registered by IGMP. THAT ROUTER send out PIM Prunes to kill out the states in the RPF/SPF related to Rendezvous point

### BGP Always-Compare-Med
Only compare the MED of two paths if they both have a MED attribute.
## VXLAN
IMPORTANT
{MAC:AAAA.AAAA.AAAA.AAAA, VNI:100010, VTEP:E1/1}
{MAC:BBBB.BBBB.BBBB.BBBB, VNI:100010, VTEP:192.168.10.22}
If the host with mac-address is directly attached, the VTEP is the outgoing interface.
If the host with mac-address is remote, the VTEP is another IP address.
VTEP can be an interface or the IP address depending on the location of the host with MAC address.
Multicast will lower the flooding of the ARP when the initial VTEP gets a packet, and flood out a few interfaces.
Other devices will sign up for that Multicast & VNI, which will determine which ones get the broadcast/ARP to find the MAC Address.
You seem them a lot in the Leaf & Spine architecture for a data center. Also called a CLOS network.
This is for Overlays/Underlays and is a better alternative to OTV. 
Uses the concept of overlay where the entire CLOS is Layer 3. This eliminates STP and have all links as forwarding without a loop.
Layer 3 allows for rapid failover, called ECMP. This means it goes to another spine switch.
VXLAN can mean what you want it to mean. Sometimes you can have the mapping for VLAN to VXLAN.
You need both L2 AND L3 in a Data Center.
L3 for Equal Cost Load Balancing and No STP and All forwarding links.
L2 for Virtual Machine IP Address Consistency.
VXLAN offers best of both worlds.
You could manually flood, the smarter move is to use MP-BGP/EVPN or Multicast to send across the MAC Addresses
### Multicast VXLAN
Scalable and preferable to Head End Replication aka 
When the ARP request from a host arrives to Leaf SW1 it will lookup its local table and if an entry is not found, it will encapsulate the ARP request over VXLAN and send it over the Multicast group configured for the specific VNI.
THE SPINE SWITCHES ARE THE RENDESVOUS POINTS
The multicast RP receive the packet and it will forward a copy to every VTEP that has joined the multicast group.
A multicast address group maps to one VXLAN number called a VNI.
BUM Traffic = Broadcast, Unknown Unicast, Multicast. BUM = Packets with multiple destinations.
Let's talk about ADDRESS LEARNING!!!
When it comes to Multicast Address Learning, there are FOUR COMPONENTS
MAC ADDRESS ---- VNI (aka VXLAN Number) ---- VTEP/IP/INTERFACE ---- MULTICAST GROUP
This table is filled when BUM Traffic from our host devices comes into the leaf switch.
It will look at the VLAN ID of the BUM traffic from the host device (hanging from leaf switch), then map VLAN ID with the VNI from the configuration, then the VNI will look at the Multicast Group mapped to the VNI (aka VXLAN Number).
The LEAF switches will be in this multicast group, representing a VNI/VXLAN Number. Or a single VLAN.
The BUM Traffic (aka packet) will go out to certain leaf switches to find the location of the Destination IP. When it gets a response, it fills out the table of Destination MAC address (overlay) to Destination IP Overlay Leaf Address
From the destination IP address of packet (overlay), it's mapped to MAC Address then IP address of remote switch (underlay leaf switch) for VTEP tunnels to form.
To reiterate, in the source leaf switch, there is a destination MAC address entry (overlay (past destination leaf switch)) MAPPED to a IP or VNI/VXLAN to a destination leaf switch. Sometimes the destination is a combination of VNI & IP, like "nve1/10.1.1.40". This applies for entries in other leaf switches, otherwise the destination is an interface.
### MP-BGP/EVPN
Also called Head End Republication. 
Not as good as multicast, only suitable generally for 20 switches.
The MAC Address table to leaf switch look the same as multicast
BGP is used for both the underlay AND overlay. I believe the underlay is for knowing which VTEP/Leaf Switch is where, and OVERLAY is for the Mac Addressses (L2VPN). 
### VXLAN Underlay BGP
For underlay BGP, the spine is the route reflector AND the leaves are the route reflector clients.
For underlay BGP, you will still have to run IGP like OSPF or IS-IS or EIGRP. BGP here may be for large amounts of routes & networks for scaling. 
### VXLAN Overlay BGP
Clearly done to advertise the MAC addresses across the fabric. Fabric is CLOS Spine Leaf architecture.
L2VPN = Address Family Identifier (25)
EVPN = Subsequent Address Family (70)
## Cisco ASA
Active/Active failover is only available to ASAs in multiple context mode. In an Active/Active failover configuration, both ASAs can pass network traffic.














# <h1 id="cisco_switching">Cisco Switching Information</h1>
## Tables
FHRP MAC Addresses | Description |
- | -
HSRP | 0000.0c07.ac0a |
VRRP | 0000.5E00.01ac |
GLBP | 0007.b400.XXYY </br>(X = Group, Y = Forwarding Number) |

Regular STP Port States (802.1d) | Extra | Description |
- | - | - |
Disabled | | |
Blocking | | |
Listening | Listening for BPDUs | Doing jack shit to see if the topology changes. BPDUs are still sent to assess the land. |
Learning | Learning MAC Addresses | Looking at the source address of Ethernet Frames to populate the Mac Address Table |
Forwarding |  | Good to go! |

Regular STP Port Roles (802.1d) | Description |
- | - |
Disabled Port | Not in STP |
Root Port | Port to reach the Root Bridge the fastest |
Designated Port | Designated port is ALWAYS forwarding!! It is the port in a link/segment that has the lowest cost to the Root Bridge. If there is an already a RP in the point-to-point link, then the other link is designated.  Also, all ports in root switch are designated. |
Non-Designated Port | This will be in the Blocking state. One segment willdk have no root ports, and the designated port will be forwarding (lowest path to root bridge), meaning the other one is non-designated and therefore will be what's blocked. |

Rapid STP Port States (802.1w) | Description |
- | - |
Discarding | Disabled/Blocking/Listening ALL IN ONE called Discarding |
Learning | Looking at the source address of Ethernet Frames to populate the Mac Address Table |
Forwarding | Good to go! |

Rapid STP Port Roles (802.1w) | Description |
- | - |
Backup | BACKUP DESIGNATED PORT</br>This port serves as a secondary designated port in case the primary designated port fails.</br>It is in a discarding state unless a failure of the designated port occurs, in which case it is moved to a forwarding state. |
Disabled Port | Not in STP |
Root Port | Port to reach the Root Bridge the fastest |
Designated Port | Designated port is ALWAYS forwarding!! It is the port in a link/segment that has the lowest cost to the Root Bridge. If there is an already a RP in the point-to-point link, then the other link is designated.  Also, all ports in root switch are designated. |
Alternate Port | ALTERNATE ROOT PORT</br>This port serves as a secondary root port in case the primary root port fails.</br>It is in a discarding state unless a failure of the root port or connection occurs, in which case it is moved into a forwarding state. Discarding is the newer term for Blocking (blocking is old STP term). Discarding replaces disabled, blocking & listening states|

Port Security Features | Description |
- | -
Aging | (config-if)# switchport port-security aging type *MINUTES* </br>By default, aging is not enabled and addresses are not deleted unless the device is rebooted or the MAC addresses are cleared through a removal command being issued
Maximum | Self-Explanatory |
Sticky | Dynamically learns and configures the MAC addresses of the currently connected hosts.

Port Security Violation | Description |
- | -
Restrict | Log Entry
Protect | No Log Entry
Shutdown | Err-Disable

STP Enhancements | Description |
- | -
BackboneFast | If there is an indirect link failure, nix off 20 seconds off the MAX AGE TIMER so it's just Listening & Learning State (15 seconds each, 30 seconds combined). 50 Seconds turned into 30 seconds

### SVI
The SVI serves as a default gateway to hosts in that VLAN. 

## GLBP Components
### Active Virtual Gateway
The AVG is responsible for answering Address Resolution Protocol (ARP) requests for the virtual IP address. It sends a different virtual MAC in response to ARP requests from the client, which in turn chooses the Active Virtual Forwarder in the group to leverage.
### Active Virtual Forwarder	
Sending out internet traffic within an group
## STORM CONTROL
(config-if)# storm-control broadcast level bps .7m .5m
Traffic is measured every second!
One method is rising & falling threshold. There are two lines called "Rising Threshold" and "Falling Threshold". If traffic exceeds rising threshold at least ONCE, then you need an entire 1 second interval below falling threshold before it's allowed to rise again.
Other method is simple percentages (on broadcast, unicast or multicast traffic)
## MITIGATION
### DHCP Snooping
Creates a binding table to link the legitimate hosts with mac addresses who were assigned the IP address in DHCP.
Not only does it create a binding table, but it also has concept of trusted ports & untrusted ports for DHCP servers which stop DHCP discover/reply etc
### IP Source Guard
Once the host gets an IP address through DHCP, only the DHCP-assigned source IP address is permitted through that interface. Uses DHCP Binding table, which has mapping of MAC-IP-Interface
### ARP Inspection
ARP spoofing attacks and ARP cache poisoning can occur because ARP allows a gratuitous reply 
Examples the DHCP Snooping Database with IP-MAC bindings to validate proper ARP packets
The switch checks the information found in the ARP request and compares it with the information in the DHCP snooping database
The aim for this is to prevent screwing with the ARP caches inside the networks. The ARP table links IP to MAC, and then the MAC address table finds the correct interface, so poisoning ARP table will send to wrong malicious interface.


# <h1 id="cisco_security">Cisco Security</h1>
### Security Level
Like a waterfall, traffic from higher can go to lower security level. Traffic from lower security level cannot go into higher security level unless initiated by the "inside" higher security level.

Terms | Description |
- | - |
Cisco Adaptive Security Appliance | Just does stateful firewalls, ACLs, remote access VPN, gateway VPN switching & security levels 
Firepower features | Everything else the sun, like application context, context awareness, malware, Talos, Snort, URL filtering, OS fingerprinting. 
Cisco ASA with FirePOWER Module | One way of having Firepower services (uses ASDM as the interface).
Cisco Firepower standalone | Uses Cisco FTD (FirePOWER Threat Defense) as the GUI, very API based. Lacks the remote access VPN like ASA but that's about it

Security Device | Description |
- | - |
ASA 55**-X | |
ASA 5585-SSP*0 | |
ASA 5500-X with FirePOWER Services | |
Firepower 1000 Series | |
Firepower 2100 Series | |
Firepower 4100 Series | |
Firepower 9300 | |


# <h1 id="cloud_computing">Cloud Computing</h1>
## Tables
AWS Policy | Description |
- | -
SID | Can be anything, it's just a description |
Principal | Account, user, role, or federated user to which you would like to allow or deny access.  </br> {"AWS": ["arn:aws:iam::111122223333:root","arn:aws:iam::444455556666:root"]}
Effect | Allow,Deny 
Action | s3:* |
Resource | Where in the Cloud/Service does this policy apply. Can be done granularly "Resource":"arn:aws:s3:::awsexamplebucket1/*",

S3 Tiers | Description |
- | -
S3 Standard | Durability 99.999999999% (NINE 9's after decimal)</br>Availability  99.99%</br> Storage Costs</br> First 50 TB / Month $0.023 per GB</br> Next 450 TB / Month $0.022 per GB</br> Over 500 TB / Month $0.021 per GB</br>
S3 Reduced Redundancy Storage | Durability 99.99%</br>Availability 99.99%
S3 Intelligent Tiering | Ideal to optimize storage costs automatically for long-lived data when access patterns are unknown or unpredictable.  </br> For a small monthly monitoring and automation fee per object, S3 monitors access patterns of the objects and moves objects that have not been accessed for 30 consecutive days to the infrequent access tier.
S3 Standard Infrequently Accessed | Durability 99.999999999% (NINE 9's after decimal)</br>Availability 99.9% Storage Costs $0.0125 per GB
S3 One Zone Infrequently Accessed | Availability 99.5% Storage Costs $0.01 per GB
S3 Glacier | Availability 99.9% Storage Costs $0.004 per GB
S3 Glacier Deep Archive | Availabililty | 99.9% Storage Costs $0.00099 per GB

EC2 Types | Description |
- | -
General Purpose | Names=> A1,T3,T3a,T2,M5,M5a,M4</br>Balance of compute, memory and networking resources.</br>Use Cases For Web Serveers & Code Repositories
Compute Optimized | Names=> C5,C5n,C4,</br>Purpose Ideal for compute bound applications that benefit from high performance processor</br>Use Cases Scientific Modeling, dedicated gaming servers & ad server engines
Memory Optimized | Names=> R5,R5a,X1e,X1,High Memory,z1d,</br>Purpose Fast performance of workloads that process large data sets in memory</br>Use Cases In Memory Caches, In-Memory Databases, real time big data analytics,
Accelerated Optimized | Names=> P3,P2,G3,F1,</br>Purpose Hardware accelerators, or co-processors</br>Use Cases Machine Learning, computational finance, seismic analysis, speech recognition,
Storage Optimized | Names=> I3,I3en,D2,H1,</br>Purpose High, sequential read and write access to very large data sets on local storage</br>Use Cases NoSQL, in-memory or transactional databases, data warehousing,
Graphics Optimized | Names=> G3,</br>Purpose 3D visualizations, mid to high-end virtual workstations, virtual application software, 3D rendering, application streaming, video encoding, gaming, and other server-side graphics workloads. Anything with a graphics card really.</br>Use Cases Gamers, AutoCAD, etc
Graviton | If you put a g after the "names" above, it is a graviton ARM CPU |

EBS Drive Name|Drive|Description|API Name|Volume Size|Max IOPS|Use Cases|
-|-|-|-|-|-|-|
General Purpose|SSD|Balances Price and Performance|gp2|1GB - 16TB|16000|"Nearly anything that doesn't need to be optimized  and where cost is not much of a concern to strike that balance"
Provisioned IOPS|SSD|Highest SSD Performance for mission-critical low latency or high throughput|io1|4GB - 16TB|64000|"Large Databases IOPS greater than 16000 Throughput greater than 250MB Throughput Optimized"
Throughput Optimized|HDD|"Low-cost. Designed for frequently accessed throughput intensive workloads."|st1|500GB - 15TB|500|"Data Warehouses Big Data Log Processing|"
Cold|HDD|Lowest HDD Cost. Less frequently used workloads|sc1|500GB - 15TB|250|
EBS Magnetic | Magnetic | Archival Storage| | 500GB - 15TB 40/200|

AWS Proton Environment Types
-
Reason: This sets up dev/staging/prod 
AWS::EC2::VPC
AWS::EC2::Subnet
AWS::EC2::InternetGateway
AWS::EC2::VPCGatewayAttachment
AWS::EC2::RouteTable
AWS::EC2::Route
AWS::EC2::SubnetRouteTableAssociation
AWS::EC2::SecurityGroup
AWS::ECS::Cluster
AWS::IAM::Role (used by ECS tasks, namely sts:AssumeRole)

AWS Proton Service Types
- 
AWS::Logs::LogGroup
AWS::ECS::TaskDefinition
AWS::ECS::Service
AWS::ElasticLoadBalancingV2::TargetGroup
AWS::ElasticLoadBalancingV2::ListenerRule
AWS::ApplicationAutoScaling::ScalableTarget
AWS::ApplicationAutoScaling::ScalingPolicy
AWS::CloudWatch::Alarm
AWS::EC2::SecurityGroupIngress
AWS::ElasticLoadBalancingV2::LoadBalancer
AWS::ElasticLoadBalancingV2::Listener


## DynamoDB
### Consistent Reads
### Eventual
Gives you the quickest answer, but it may be wrong because the data has not propagates across Availability Zones
### Strongly
Gives you the most accurate answer (which would be universal across Availability Zones), but at a cost of speed
### DAX
DynamoDB Accelerator (DAX) is a fully managed, highly available, in-memory cache for DynamoDB that delivers up to a 10x performance improvement – from milliseconds to microseconds – even at millions of requests per second.
### Index
### Local Secondary Index
Can only be done on creation of the table
An index that has the same partition key as the table, but a different sort key.
### Global Secondary Index
An index with a partition key and sort key that can be different from those on the table.
### Terms
### Table Components
### Item
Row/Instance of Entity
### Attributes
Columns
### Keys
### Partition Key
Primary Key
Will separate various rows into it's own smaller rows. This is done for easier faster reads. It's similar to how Apple has it's own folders for music files, with folders having One Letter in the Alphabet based on music filename. Think of Map-Reduce where computing is done simultaneously in chunks.
### Partition key & Sort Key 
Composite key
Referred to as a composite primary key, this type of key is composed of two attributes. The first attribute is the partition key, and the second attribute is the sort key.
DynamoDB uses the partition key value as input to an internal hash function. The output from the hash function determines the partition (physical storage internal to DynamoDB) in which the item will be stored. All items with the same partition key value are stored together, in sorted order by sort key value.
In a table that has a partition key and a sort key, it's possible for two items to have the same partition key value.
## Kinesis
### Kinesis vs SQS
Kinesis allows real-time processing of streaming big data and the ability to read and replay records to multiple Amazon Kinesis Applications.
Producer & Consumer model where you can put records & get records
In Python, data is sent as a "byte stream"
No shard auto-scaling like SQS









# <h1 id="cloud_networking">Cloud Networking</h1>
## Tables
VPC Limits | Description
- | -
WHY use Accounts over VPCs to segment workloads? | Limits are the primary reason </br> I prefer large VPC's with a Transit Gateway to be honest</br> If you really need more han 1000 VPC's, it is this primary case where you use multiple accounts!</br>
VPCs in a region | 5 |
Subnets in VPC | 200 |
Elastic IPs in Region | 5 |
Customer Gateways in Region | 50 |
Internet Gateways in Region | 5 |
NAT Gateways in Region | 5 |
Virtual Private Gateways in Region | 5 , Can only attach one at a time, but can configure 5 in waiting.
ACLs in VPC | 200 |
Rules in ACL | 20 |
Route Tables in VPC | 200 |
Routes in Route Table | 50 |
Security Groups in Region | 2500 |
	Can extend to 10000 under support
Rules in Security Group | 60 |
Security Gruop in Interface | 5 |
Gateway VPCs in Region | 20 |
Interface VPCs in Region | 20 |

Route 53 Tags | Description
- | -
A | 		Map a server name to an IPv4 Address |
AAAA | 		Map a server name to an IPv6 Address |
ALIAS | 		Aliases are an AWS only feature.</br> | Similar to CNAME</br> Aliases resolve directly to an IP address, saving the extra lookup which a CNAME would require</br> Allows weighted/latency/geo-routing/failovers</br> Points directly to resources, unlike with CNAME where you would have to change each time the path changes.</br> Seems it points to Amazon Only endpoints</br> Alias has no charge</br>
CNAME | 		Map a simple name like bog.example.com to another name (NOT ip-address) such www.goon.com</br> |
	Stands for Canonical Name</br>
MX | 		Determine the mail servers that receive mail for a particular domain |
NAPTR | 		Name Authority Pointer |
NS | 		Used to determine which DNS service is authoritative to serve responses to DNS queries for the domain |
PTR | 		Reverse entry of mapping IP addresses for the FQDN. Example of FQDN is mail.example.com. |
SOA | 		Mandatory records for each domain that determine the authoritative DNS servers and keep a timestamp and version record of the domain zone |
SPF | 		Sender Policy Framework |
SRV | 		Deliver information on ports the hoses serves it's services on? |
TXT | 		Share arbitrary strings of text within the DNS service and thus extend the functionality or security of our domain and the services running on the servers belonging on our domain |

Router 53 Routing Policies | Description |
- | - 
Simple Routing | 		Chooses a record at completely random </br> If you have www.goon.com pointing at 3 different IP addresses in 3 different record sets, one will be chosen at random
Weighted  | 		If you have multiple record sets with same IP address, choose a weight from 0 to 100 </br>
Latency-Based | 		Closest REGION based on Latency |
Failover | 		Set up a record as primary/secondary in an active/standby setup. Use health checks. |
Geolocation | 		You can choose the exact region you want based on the location of where the person is coming from.  |
Multi-Value Answer | 		Really the exact same as Simple Routing EXCEPT it considers health check and ignores those who are sick/unwell |

## WHY use Accounts over VPCs to segment workloads? 
Limits are the primary reason 
I prefer large VPC's with a Transit Gateway to be honest
If you really need more han 1000 VPC's, it is this primary case where you use multiple accounts!
Amazon Cloud Networking
### VPC Peering
Attributes
Non-Transitive
Limits
The maximum quota is 125 peering connections per VPC. 
### VPN
Features
Each VPN has two tunnels inside of it.
TUNNELS IP ADDRESS IS
169.254.0.0/16 
BUT CAN'T USE
169.254.0.0/30
169.254.1.0/30
169.254.2.0/30
169.254.3.0/30
169.254.4.0/30
169.254.5.0/30
169.254.169.252/30
### CGW (Customer Gateway)
A Customer Gateway is the anchor on the customer side of an Amazon VPN Connection
Customer Gateway, clearly, is on our premises side
### VGW (Virtual Private Gateway)
AWS Cloud Side (not on premises)
Responsible for hybrid IT connectivity leveraging VPN & Direct Connect
The VGW is attached to the VPC. It's at the edge of the VPC connecting to Direct Connect Gateways, or VPN, or Direct Connection Colocation facility to a CGW
### Route tables
Every single Route Table corresponds to a VPC that's created
Cliff Youu need a Subnet Association to link the Route Table to a Subnet
Linking a route table to a VPC is already an intrinsic part of the Route Table type/entity
Route Table needs a "Subnet Association" to correspond with a subnet in a VPC. There is no field inside of a Route Table entity that connects to a Route Table without the existence of a separate "Subnet Association" type.
Subnet Associations are a TAB in the Route Table section in VPC. In Terraform, A Subnet Association is called "aws_route_table_association" instead.
resource "aws_route_table_association" "RTTFAssoc" {
subnet_id = aws_subnet.subnet01.id
route_table_id = aws_route_table.TFRouteTable.id
}
Example
192.168.0.0/20	      local
0.0.0.0/0        igw-0b6c3f81061f0b371
### NAT Gateway
NAT Gateways are different than Internet Gateways in that NAT Gateways can be placed into private subnets and initiate communication towards the internet in a stateful approach.
Internet Gateway
Makes a subnet public via a route table entry to the IGW
VPC (Virtual Private Cloud)
VPC Creation
Name Tag (optional)
IPv4 CIDR Block (10.0.0.0/24)
Radio Box for IPv6 CIDR Block
Tenancy (Default/Dedicated)
Tags
### PrivateLink
Types
Interface Endpoint To Services
Interface Endpoint To Network Load Balancer
### Troubleshooting
EC2's Security Group
Elastic Network Interface's Security Group
IAM User/Role in EC2 for permissions to PrivateLink
### TGW
### Components
Transit Gateway
All VPCs connect here.
In Terraform at least, there are no routes here. Only field/attribute here is the Transit Gateway itself. This is in contrast to the cloud representation of regular routes tables, where the routes were attributes of the route table object, rather than their own type. (Note, we're just looking at Terraform)
It seems like a virtual link, or a virtual wire between a VPC/Direct Connect Gateway/Peering Connection/VPN.
TRANSIT GATEWAY ATTACHMENTS SHOW UP AS A DESTINATION to the Transit Gateway Route Table, but NOT the route table for VPCs. 
From VPC routing table, the default route is generally the TRANSIT GATEWAY, NOT THE ATTACHMENT. From Transit Gateway routing table, the destination to VPC is the attachment. The attachment attaches the VPC to Transit Gateway.
TRANSIT GATEWAY ROUTE TABLE (NOT VPC)
10.0.0.0/16 tgw-attach-123 
192.168.0.0/16 tgw-attach-789
172.31.0.0/16 tgw-attach-456 
172.31.0.0/16 tgw-attach-789 
Note. There are routing tables within the main routing table in the Transit Gateway
### Route Propogations
With Route Propagations, it AUTOMATICALLY puts the routes (to attachments) into the TGW routing table!
An entity representing the propogation itself within the cloud. Usually propogations in a VPN or Direct Connect can happen with BGP, but from other VPCs in the Cloud it is through a propagation entity itself.
### Direct Connect
### Private Virtual Interface
A Private Virtual Interface should be used to access an Amazon VPC using private IP addresses
### Public Virtual Interface
A public virtual interface can ACCESS ALL AWS PUBLIC SERVICES using public IP addresses (Wonder if AWS PrivateLink has a role in this)
### Transit Virtual Interface
A transit virtual interface should be used to access one or more Amazon VPC Transit Gateways associated with Direct Connect gateways. You can use transit virtual interfaces with 1/2/5/10 Gbps AWS Direct Connect connections. For information about Direct Connect gateway configurations, see Direct Connect gateways.
These interfaces go from the Customer Router in the CRF Colocation onto the VGW or Direct Connect Gateway.
These seem like Subinterfaces that have a VLAN tag





































# <h1 id="microsoft">Microsoft</h1>
Active Directory | Description |
- | - |
Objects | 		Certificate Template |
Computers  |
Connection |
Contact |
Containers |
Domain | 		A domain is a group of users, computers and other resources that are accessed and monitored with a certain set of rules. |
Domain Controller | 		A domain controller (DC) maintains the policies and provides the authentication to the users of the domain. Every domain functions as a boundary for policies, authentication and authorization. |
Generic Object
Groups | 		You put a user in a group to control that user's access to resources.  |
Group Policy Objects |
IP Subnet |
Licensing Site |
Policy |
Print Queue |
Organizational Units | 		Collectiom of AD leaf objects like users, computers, printers etc. </br> You put a user in an OU to control who has administrative authority over that user.</br> A Type of container</br> A user can only be in ONE Organizational Unit.. It's like a file to a folder, because OU's are like folders</br> Generally separated by departments like HR, Finance, Sales, etc</br> Group policies happen here (weirdly not in groups)</br>
Server |
Site |
Site LInk |
Site Link Bridge |
Tree | 		A collection of Active Directory hierarchical domains in a contiguous namespace.. |
Trust | 		A relationship between domains that allows access by objects in one domain to resources in another. |
Users |
Volume |

Cool Microsoft Functions | Parameters |
- | - |
VirtualAlloc | lpvAddress, dwSize, dwAllocationType
VirtualAllocEx | hProcess, lpvAddress, dwSize, dwAllocationType
WriteProcessMemory | hProcess, lpBaseAddress, lpBuffer, nsize, lpNumberOfBytesWritten (2nd = destination, 3rd = source)
ReadProcessMemory | hProcess, lpBaseAddress, lpBuffer, nsize, lpNumberOfBytesRead (2nd = source, 3rd = destination)

VirtualAlloc | 	Description |
- | - |
lpvAddress | Starting address in virtual memory. RESERVING it in Virtual Memory sends it to the next 64kb boundary. COMMITTING it in Physical Memory (after reserving) sends it to next page boundary, usually 4kb boundary. If it is NULL, the kernel decides where to put it (depending on the flag (dwAllocationType) reserving to virtual memory, or committing to physical RAM memory)</br>
dwSize | Size of the region in bytes - If the lpAddress parameter is NULL, this value is rounded up to the next page boundary. Otherwise, the allocated pages include all pages containing one or more bytes in the range from lpAddress to lpAddress+dwSize. 
dwAllocationType| MEM_RESERVE (0x00002000) = Virtual Memory to 64kb boundary </br> Many more like MEM_LARGE_PAGES and MEM_WRITE_WATCH in https://docs.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-virtualalloc</br> Commit = 5th bit is 1 from right, Reserve = 6th bit is 1 from right</br> MEM_COMMIT (0x00001000) = Reserve physical RAM to 4kb boundary </br> MEM_TOP_DOWN (0x00100000) = Allocates to highest possible address.</br> Many more like MEM_LARGE_PAGES and MEM_WRITE_WATCH in https://docs.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-virtualalloc</br> Commit = 5th bit is 1 from right, Reserve = 6th bit is 1 from right</br> dwProtect</br> Security in a dWord (32 bits) like PAGE_EXECUTE, PAGE_EXECUTE_READWRITE. Reminds me of chmod for a region of COMMITTED PAGES!!</br>

VirtualAllocEx | Description |
- | - |
hProcess | Process Handle to write in next 4</br>Next 4 parameters are those in VirtualAllocEx |

WriteProcessMemory | 		Description |
- | - |
hpProcess|	The Process where memory is to be written
lpBaseAddress | (DESTINATION) Address INSIDE the process where the writing will happen. The process must have PROCESS_VM_WRITE or PROCESS_VM_OPERATION access. NOTE: THE ARGUMENT IS THE RESULT OF VIRTUALALLOCEX!!!!!! as I suspected
lpBuffer| (SOURCE) The Source Pointer from source program containing the data to go inside the process in lpBaseAddress (prior paramter)</br>The number of the bytes to write from lpBuffer to lpBaseAddress
lpdwBytesWritten | 	A pointer containing the amount of bytes that were successfully written (passed by reference). A number will come back. This can be NULL

ReadProcessMemory | Description |
- | - |
Notes | Identical to WrtiteProcessMemory (but for 2nd & 3rd parameters) 
lpBaseAddress | (SOURCE) Address to remote process to start from....JUST like the 2nd parameter in WriteProcessMemory
lpBuffer | (DESTINATION) Address in local current process to store information coming from lpSource. It's highly similar to the 3rd parameter in WriteProcessMemory, but its being READ INTO, instead of going out since it's READ process memory, and not WriteProcessMemory

Sentinel | 	
- | 
Incidents |
Dashboards |
User Analytics |
Hunting |
Notebooks |
Data Collection |
Analytics |
Playbooks |
Community |
Workspace |

Powershell | Description |
- | - |
Commands | 		
Get-Command | get-command *process* will search all cmdlets for process
Get-Process | Self-Explanatory |
Get-ADUser | Self-Explanatory |
Get-ItemProperty  | Get value from File or Registry |
Get-WMIObject | Subtopic 1 |
Select-Object | Goes after Pipe to filter output |
Where-Object | 

Win32 API Topics |
- |
Style Guide |
Win32 vs Win16 |
Creating Windows |
Creating Windows Part 2 |
Messages |
Menus |
Resources (Any kind of a file like Bitmap, Text, etc) |
Dialog Boxes (meaning boxes for Open File, Choose Color, Page Setup, Print Options) |
User Input Functions (Mouse, Keyboard) |
Scrollbars |
Memory Management |
Graphics Device Interface |
Bitmaps, Icons, Metafiles |
Printers & Text Output |
Painting & Drawing |
Palettes and Color Matching |
Files |
Clipboard |
Registry |
INI files |
System Information |
String Manipulation & Unicode |
Atom Tables |
Timers (Sleep Functions) |
Processes, Threads, Fibers |
Error & Exception Handling |
Multiple Document Interface |
Help Files |
File Decompression & Vision |
DLL Files |























































# <h1 id="software_engineering" >Software Engineering</h1>
## Tables
Commodore Commands | Description |
- | - |
ABS | ABS(-10) |
CONT | Continues program execution from line where program was halted |
DATA | DATA A, "B", C </br> Initializes a set of values that can be used by READ statement</br> DATA seems like one data stream, like Kinesis
DIM | DIM A$(4) </br> One Dimensional Array of 5 elements</br>DIM C%(2,3)   </br>wo Dimensional Array of 3 and 4 values</br>ND  Program is over. Back to READY |
FOR | 10 FOR X=10 TO 0 STEP -0.25: PRINT X: NEXT X |
GET | GET A$ OR A </br> Get a one character value
GOSUB | 20 SP = 20: ZE = 3: A$ = "Good Morning!": GOSUB 1000: GOSUB 2000 </br> 1000 REM cursor positioning and printing</br> 1010 POKE 211,SP :POKE 214, ZE: SYS 58640 : PRINT A$</br> 1020 RETURN</br> |
IF | 70 IF A$="+" THEN C=A+B: B$="ADDITION" |
INPUT | INPUT A$ OR A </br> Prints ? on screen and waits for a user to enter a string or integer
LEFT | LEFT$(A$,X) </br>Returns the X values from the last of String at A$
MID | MID$(A$,X,Y) </br>Returns Y characters from string A$ from X
NEXT | Return to beginning of loop |
PEEK | A = PEEK(53281) </br> Gets the background color
POKE | Example </br> POKE 53280,1 </br> Screen Frame is now white |
READ | READ A$ OR A </br> Assigns next DATA value to A$ or A
RESTORE | Go back to the beginning of the DATA stream! </br> STR$  STR$(-1000) </br> Convert number into string
SYS  | SYS 4000 </br> Start a machine language program!!
TAB | TAB(4) </br> Put in Print Statements
USR | USR(X) </br> Passes value of X to a machine language subroutine
VAL | VAL(S$) </br> Convert string to int

C++ STL Standard Template Library | Description |
- | - |
Vector | Add to the end only, as dynamic</br>Fast Insertion/Removal</br>Finding by Index fast</br> Finding by object very slow
Deque | Allows adding to the beginning & end</br>Only disadvantage is finding by index is slower than vector
List | Linked List</br>Very similar to Deque, but locations are all over memory</br>One difference with List compared to Deque is that inserting can happen in middle
Forward List | Like a list, but there's only one pointer going to the next element.</br>No huge difference between List. 
Set | STORES ITEMS IN A BINARY TREE STRUCTURE</br>Overhead when inserting</br>Finding items is way faster than insertion, because insertion sorts each time & puts it in sorted Binary Search Structure</br>Stores unique values which are sorted in a logarithmic complexity</br>Insert/Remove/Find = O(log(n))
Unordered Set | Stores unique values that are NOT ordered.</br>USES HASHING</br>GREAT FOR FINDING & RETRIEVING, shit for iterating. Never use unordered sets for iterating & traversing</br>UNORDERED MEANS HASH MAP!!
Map | Key-Value Pairs inserted AND sorted with Logarithmic complexity</br>Insertion/Access/Remove/Find is Logarithmic</br>You could still order/iterate.
Unordered Map | Key-Value Pairs inserted AND sorted with Linear complexity</br>HASH TABLE</br>Insertion/Access/Remove/Find is n(1) which is Linear & Best Case Scenario</br>I'm guessing the tradeoff happens with ITERATING which would be impossble or practically useless
Multiset | Sets with multiple values, that's ordered for iteration.</br>You'd use a Multiset when you want the SORTED BEHAVIOR on insertion automatically compared to Vector/Deque
Unordered Multiset | Sets with multiple values, but with hash maps
Stack | Stores elements in a Last-In-First-Out fashion.</br>Push/Pop/Top = O(1)
Queue | Stores elements in a First-In-First-Out fashion.
Priority Queue | Stores elements in a sorted order. First gets priority.

C++ Const & Pointers | Descr
Notes | When it comes to pointers & const, read right to left. IGNORE TYPE |
const int * | CAN CHANGE POINTER, NOT INTEGER </br> Pointer to constant integer OR Pointer to integer constant  </br> Cannot change object being pointed at |
int const * | SAME AS ABOVE </br> CAN CHANGE POINTER, NOT INTEGER </br> Pointer to constant </br> Pointer to constant integer </br> Cannot change object being pointed at </br> Same as above |
int * const | Constant pointer, the pointer is constant | 
const * int | DOES NOT APPLY!!! C:\makeshift\files\test_scripts\test.cpp:10:13: error: expected unqualified-id before 'int' </br> Cannot have variables that begin with pointers either </br> I believe there must be a type before the pointer symbol |
int const * const | We know |
const int * const  | We know |

C++ Auto && | Description |
- | - |
rvalues | Usually they are parameters lixadxke Widget&& that are sent disposable anonymous objects in the arguments. This just passes the buck to the function. This is used for move semantics. Copy semantics uses pointers, not RValues |
auto&& | Not an rvalue reference like int&& or Widget&&. </br> Catch all reference used in For Loops|

Rust | Description |
- | - |
let a = 40 <> let c = &mut a | NO!!! |
let mut a = 40 <> let c = & a | SOMEWHAT!!! </br> Warning: variable does not need to be mutable |
let a = 40 <> let &c = & a | YES <br> Immutable reference |
let mut a = 40 <> let c = &mut a | YES!!! </br> When it comes to mutable references, there can only be ONE |
let a = 40 <> let c = &a | YES!!! </br>Immutable References </br> You can have MULTIPLE references that are immutable, unlike immutable (&mut) that must only have one </br> If you put & as an argument, then the function can BORROW the variable, and it won't be deleted after function is finished. |
let a = 40 <> let c = a | YES!!! </br>When this happens, a is gone. MOVE semantics just take away variable "a".
Scoping Mutable References |
(references) let b: &i32 = &a | In C++, this is equivalent to int& b = &a, in real C++, there would be no & in a. C++ has the & in the parameters because you have to put the whole type down. Looking at the arguments/parameters, C++ is a->a, Rust is &a->a. The type of the variable is a reference WITH &.
NOTE | When passing references, argument has "&" and parameter has "&", with result IN function AND calling function being the deferenced value (not pointer address)
Option<T> | Some(T) / None. This means Something or Nothing. |
Result<T,E> | Ok(T) / Err(E). | 
* | Note, * character is only used for Box,Rc,Arc,wrappers, and not for &references. Immutable unless RefCell |
Box<T> | Typically used for polymorphism like Box<dyn Animal>. |  
Rc<T> | Reference counter where an object can have many owners |
Arc<T> | Atomic reference counter that's thread safe

Magento | Description
- | - |
app | |
app/design | |
app/design/frontend | Each module in each theme has layout/web folders, with other folders containing html/phtml files |
app/design/adminhtml | |
app/etc | di.xml for dependency injection, and vendor paths & registrations |
app/i18n | |
app/code | Modules containing Models/Controllers/Blocks |
app/code/Magento | The actual code of Magento (models/controllers), corresponding with catalogs & checkout, etc |
app/code/<vendor_name> | Your own custom code |
bin | Only has Magento CLI executable script |
dev | Stores automated functional tests which were run by the Magento Test Framework. |
lib | CORE MAGENTO CODE. This contains all of Magento and vendor library files. It also includes all the non-module based Magento code. Basically, these are primitive objects that you will find in app/code|
phpserver | This has the Router.php file which can be used to implement the PHP built-in server. |
pub | An index.php file will be stored in this directory. You can use this file to run the application in production mode, as a security measure. Also has theme static files |
setup | Magento’s installation setup |
var | Variety of subfolders which contains classes, sessions, cache, database backups, and cached error reports. |
vendor | NOTHING TO BEGIN WITH. THIS IS WHERE THIRD PARTY MAGENTO CODE FROM OTHER EXTENSIONS GO. If you're making your own It may be possible that custom code to override App/Code is put here |


Design Patterns | Description |
- | - |
Abstract Factory | factory1 = ConcreteFactory1()</br></br> factory2 = ConcreteFactory2()</br></br> product_a = factory1.create_product_a()</br> product_b = factory2.create_product_b()</br>
Adapter  | If a strongly typed language expects one data type in the function but you want another, just make an adapter. </br> // Somewhere in client code.</br> hole = new RoundHole(5)</br> rpeg = new RoundPeg(5)</br> hole.fits(rpeg) // true</br> small_sqpeg = new SquarePeg(5)</br> large_sqpeg = new SquarePeg(10)</br> hole.fits(small_sqpeg) // this won't compile (incompatible types)</br> small_sqpeg_adapter = new SquarePegAdapter(small_sqpeg)</br> large_sqpeg_adapter = new SquarePegAdapter(large_sqpeg)</br> hole.fits(small_sqpeg_adapter) // true</br> hole.fits(large_sqpeg_adapter) // false</br>
Bridge | You can prevent the explosion of a class hierarchy by transforming it into several related hierarchies.</br> Classes have the single responsibility principle. Hierarchies should have the same thing. Bridge means that adding new attributes does not change another attribute's class tree hierarchy of classes/subclasses.</br> Composition over Inheritance</br> Uses Dependency Injection for composition.</br> tv = new Tv()</br> remote = new RemoteControl(tv)</br> remote.togglePower()</br> radio = new Radio()</br> remote = new AdvancedRemoteControl(radio)</br>
Builder | You dont' have to build specific rigid objects/rigid classes</br> CarBuilder builder = new CarBuilder()</br> CarManualBuilder builder = new CarManualBuilder()</br> builder.reset()</br> builder.setSeats(2)</br> builder.setEngine(new SportEngine())</br> builder.setTripComputer(true)</br> builder.setGPS(true)</br>
Composite | Composite is a structural design pattern that lets you compose objects into tree structures and then work with these structures as if they were individual objects.</br> Very similar to Javascript DOM with CreateElement, think of it that way</br> branch1 = Composite()</br> branch1.add(Leaf())</br> branch1.add(Leaf())</br> branch2 = Composite()</br> branch2.add(Leaf())</br> tree.add(branch1)</br> tree.add(branch2)</br>
Command | THE BEST WAY TO THINK OF THIS IS FOR TYPICAL CLASS FUNCTIONS TO BE THEIR OWN CLASSES. Then you pass in the command object into the class and call it's execute function. This allows functionality like UNDO</br></br>Command objects abstract away the FUNCTION of an object. For example, the clicking mechanism of a button will not be in the button itself.</br> Think of HTTP Get Requests in a command pattern. Other "commands" are like Cut, Copy, Undo, Print, etc.</br> It kiiind of looks like the Builder class a little bit to me, but for one function, instead of 5-10+ with Builder</br> cut = function() { executeCommand(</br> new CutCommand(this, activeEditor)) }</br> cutButton.setCommand(cut)</br> shortcuts.onKeyPress("Ctrl+X", cut)</br> invoker = Invoker()</br> invoker.set_on_start(SimpleCommand("Say Hi!"))</br> receiver = Receiver()</br> invoker.set_on_finish(ComplexCommand(receiver, "Send email", "Save report"))</br> invoker.do_something_important()</br>
Decorator | Decorators can extend an object’s behavior without making a new subclass.</br> Don't like it too much</br>
Facade | No</br>
Factory | The reason we have this is to NOT alter current code if there's another object in the factory to be generated. It also looks cleaner.</br> Instead of using the New operator, you're calling a static factory method in the family. It's also using IF conditionals under the hood</br>
Flyweight |
Iterator |
Mediator | Mediator is a behavioral design pattern that lets you reduce chaotic dependencies between objects. </br> Airplanes don't talk to each other, they go through Air Traffic Control. Same with objects with single responsibility to reduce coupling.</br> Different mediators can handle different communications/coupling between different objects. It's really offloading the coupling.</br> Mediators are in every component, by dependency injection/composition</br> c1 = Component1()</br> c2 = Component2()</br> mediator = ConcreteMediator(c1, c2)</br> print("Client triggers operation A.")</br> c1.do_a()</br> print("Client triggers operation D.")</br> c2.do_d()</br>
Memento | Memento pattern is widely used for undo machanisms. It works on the principles of history and state management.</br>
Prototype | The Prototype pattern delegates the cloning process to the actual objects that are being cloned. The pattern declares a common interface for all objects that support cloning. </br> Just put CLONE in the superclass, and implement it in subclasses.</br>
Proxy | Simply a class that acts on behalf on another class.</br>
Observer | We all know what it does.</br> Subject has attach, detach & notify methods. </br> Observer has update methods.</br> Notify will do the for loop over update methods.</br> looks like</br> subject.attach(observer_a)</br> subject.attach(observer_b)</br>
Singleton |
State |  Strategy Patterns are in each State object. A state object can have 2 to 5 to 10 methods, among different state objects.</br> A context object can have a State Object. A state object can have a context object. Two way.</br> context = Context(ConcreteStateA())</br> context.request1()</br> context.request2()</br>
Strategy | POLYMORPHISM IN A SEPARATE OBJECT!!!!!!!! Offloads unrelated behavior of a class into other classes called strategies. Those strategies will be represented as interfaces which will have subclasses.</br> Dependency Injection will be heavily used with the Strategy pattern. Often time, it will be many interfaces.</br> It contrastsq with State Pattern because there can be often multiple "strategies" (of an interface's data type/polymorphism) put in the constructor with many arguments. State Pattern is different because it changes behavior of the main object itself, while "strategies" are represented with many unrelatedsubtrees.</br>  ANOTHER way to see strategy is that polymorphism is moved to another class rather than in client: mediaPlayer = MediaPlayer(YouTubeSearch()).search()
Template | This adds standard usual behavior/code BEFORE OR AFTER a changing set of code. The code that changes will be implemented by subclasses.</br> Developers often use it to provide framework users with a simple means of extending standard functionality using inheritance.</br> Think of Python Decorators with Template pattern.</br> There is only one tree in this pattern with the top interface having two methods.</br> One function calls the other (with standard unchanging code around it) which the subclasses will implement & override.</br> abstract_class.template_method() - "Template method" will call subclass methods, so the template method changes</br>


React Hooks | Description |
- | -
constructor | Mount immediately before render | Initialize State
componentDidMount | Execute some custom code when mounting immediately after render</br>Initialize state that requires DOM nodes, network requests and side effects
shouldComponentUpdate | Update immediately after render</br>Allows developer to prevent rendering render, Code to display the component |
getSnapshotBeforeUpdate | Update immediately before render output is committed to DOM</br>Capture DOM information such as scroll position which could change
componentDidUpdate | Execute some custom code when updating immediately after render</br>Operate on updated DOM or handle network requests
getDerivedStateFromProps | Mount and update before render</br>Takes props and state as parameter Used when state depends on props
componentWillUnmount | Unmount, Clean up things such as event handlers, cancel network requests, etc

React Hooks |
- |
useState | 
useEffect |
useRef |
React.memo |

## Assembly Facts
Memory is generally represented with HIGH numbers on the top, and lower numbers on the bottom
## Mutex
An object where one resources takes something and the other has to wait. Stands for Mutual Exclusion.
## Semaphore
A semaphore seems like smaller mutexes that can lock more objects, while a mutex seems like it just locks one.
## Angular
	Angular
		Angular Components
			import { Component, OnInit } from '@angular/core';
	import { FormGroup, FormBuilder } from '@angular/forms';
	@Component({
	  selector: 'reactive-form',
	  template: `
	    <div>
	      <form [formGroup]="form"
	            (ngSubmit)="onSubmit(foiption |
- | - |rm.value, form.valid)"
	            novalidate>
	        <div>
	          <label>
	            Name:
	            <input type="text" formControlName="name">
	          </label>
	        </div>
	        <div>
	          <label>
	            Email:
	             <input type="email" formControlName="email">
	          </label>
	        </div>
	      </form>
	    </div>
	  `
	})
	export class ReactiveFormComponent implements OnInit {
	  public form: FormGroup;
	  constructor(private formBuilder: FormBuilder) { }
	  ngOnInit() {
	    this.form = this.formBuilder.group({name: [''], email: ['']});
	  }
	}
## Vue Component
	import Vue from 'vue';
	import Logger from 'utils/logger';
	import Auth from 'actions/auth';
	import Notification from 'utils/notification';
	Vue.component('change-password', {
	  template: '<div>{{ /* template */ }}</div>',
	  data() {
	    return {
	      password: '',
	    };
	  },
	  methods: {
	    changePassword() {
	      Auth.changePassword(this.state.password).then(() => {
	        Notification.info('Password has been changed successfully.');
	      }).catch(error => {
	        Logger.error(error);
	        Notification.error('There was an error. Please try again.');
	      });
	    },
	  },
	});
## Vue Stand Alone Component
	<template>
	  <form v-on:submit.prevent="onSubmit">
	   <label>
	       Email:
	      <input type="email" v-model="email">
	   </label>
	   <label>
	     Password:
	     <input type="password" v-model="password" />
	   </label>
	   <button type="submit">Send</button>
	  </form>
	</template>
	<script>
	import Auth form './util/auth.js';
	export default {
	  data() {
	    return {
	      email: '',
	      password: ''
	    }
	  },
	  methods: {
	    onSubmit() {
	      Auth.signIn(this.email, this.password);
	    }
	  }
	}
	</script>
## React Stand Alone Componant
	import React, { Component } from 'react';
	export default class ReactForm extends Component {
	  state = {
	    email: '',
	    password:'',
	  };
	  handleChange = ({ name, value}) => {
	    if (name === 'email') {
	      this.setState({ email: value });
	    } else if (name === 'password') {
	      this.setState({ password: value });
	    }
	  };
	  render() {
	    return (
	      <form>
	        <label>
	          Email:
	          <input
	            name="email"
	            type="email"
	            value= {this.state.email }
	            onChange={ this.handleChange }
	          />
	        </label>
	        <label>
	          Password:
	          <input
	            name="password"
	            type="password"
	            value={ this.state.password }
	            onChange={ this.handleChange }
	          />
	        </label>
	      </form>
	    );
	  }
	}
### Erlang
Erlang processes are lightweight, operate in (memory) isolation from other processes, and are scheduled by Erlang's Virtual Machine (VM). The creation time of process is very low, the memory footprint of a just spawned process is very small, and a single Erlang VM can have millions of processes running.
Erlang processes are sfmall C structs that boucne around between scheduler threads and carry enough internal information to allow interpretation for a fixed number of instrucitons. There's no concept of shared memory in Erlang/Elixir: communication between different concurrent actors in the system must happen via message passing.
### Algorithms
Algorithms|N-Time|Description|
-|-|-|
Merge Sort|N-Log(N)|Divide array into two parts</br>swap when we are at pairs</br>Keep on going until everything is "Size 1"</br>Put everything back together by sorting back exponentially by two, by comparing the value of sorted array to an adjecent "chunk"'s value
Quick Sort|N-Log(N)|It is very similar to Merge Sort, however, it's not dividing by TWO. It's picking a value called a pivot. Pivot is on the LEFT or RIGHT side of chunk (chunks are called partitions). Values beneath to the pivot is to the left, and values above pivot are to the right. There's no need to combine them (reduce) after the fact. Efficiency is based on distribution of numbers. If already sorted, it may pose a problem, and likely be N^2.
Bubble Sort|n^2|Take a sliding scale of two, and run it through the array, sorting along the way along this sliding scale of two.

Inteview Algorithms|N-Time|Description|
-|-|-|
A as root, B & E as 1st layer, C & D as 2nd layer beneath B (nothing under E) | - | - |
Depth First Search|n|ABCDE!! Will look all the way down first on left side, then start going on right side when working it's way back up. Think of inverting a binary tree. Left Left Left Right Root Left Left Right.
Breadth First Search|n|ABECD!! Top down.



# <h1 id="Administration">Administration</h1>
## DevOps
Kubernetes Term | Description |
- | - |
Container | |
Pod | Pod can have many containers |
Node | Node can have many pods |
Kubelet | The kubelet is the primary "node agent" that runs on each node.  | 
KubeProxy | Watches the API server for pods/services changes in order to maintain the network up to date. |
Master | The puppet master. Has Northbound & Southbound API like a controller |
KubeCTL | Sends commands to the master. Users are the real master who tells Kubernetes master what to do.  |




# <h1 id="configuration" >Configuration</h1>
## IPv6
### Set
Router(config)# ipv6 unicast-routing
Router(config)# int e0/0
Router(config-if)# ipv6 address FEC0::/64 eui-64
Router(config-if)# ipv6 address FEC0::1:1234:23FF:FE21:1212 eui-64
### Access List
R1(config)# ipv6 route FEC0::2222/64 FEC0::1111:3E5F:2E5B:A3D1 
### Tunnels
### Simple
Router> enable
Router# configure terminal
Router(config)# interface tunnel 0
Router(config-if)# bandwidth 1000
Router(config-if)# keepalive 3 7
Router(config-if)# ip address 192.168.1.1 255.255.255.252
Router(config-if)# tunnel source Ethernet 1
Router(config-if)# tunnel destination 54.34.78.222
Router(config-if)# tunnel key 1000
Router(config-if)# tunnel mode gre ip
Router(config-if)# ip mtu 1400
Router(config-if)# ip tcp mss 250
Router(config-if)# tunnel path-mtu-discovery
Router(config-if)# end
SOURCE CAN HAVE INTERFACE (E0/0) OR IP ADDRESS 
DESTINATION CAN ONLY HAVE THE IP ADDRESS
THE TUNNEL SOURCE & DESTINATION ADDRESSES COULD BE PUBLIC IP ADDRESSES IF IT IS THROUGH A WAN NETWORK. THEY ARE THE UNDERLAY IP ADDRESSES, WHICH TRANSFERS THE TRAFFIC OF THE OVERLAY
The Tunnel IP address (not source/destination) is the overlay IP network that is a extension/continuation of the network. An overlay of the hosts at other ends of Tunnel Router. Usually would be the PRIVATE addresses.
## NAT
### Initializing
R1(config-if)# ip nat inside
R1(config-if)# ip nat outside
### Dynamic NAT
R1(config)# access-list 1 permit 10.0.0.100 0.0.0.0
R1(config)# ip nat_pool MY_POOL 155.4.12.1 155.4.12.3 netmask 255.255.255.0
R1(config)# ip nat inside source list 1 pool MY_POOL
### PAT
R1(config)# access-list 1 permit 10.0.0.100 0.0.0.0
R1(config)#ip nat inside source list 1 interface Gi0/1 overload
NOTE: A different port number will be on the IP address in that interface
### ACCESS LISTS
### Standard
R1(config)#access-list 99 permit 192.168.1.128 0.0.0.15
### Extended
R1(config)#access-list 101 remark MY_ACCESS_LIST
R1(config)#access-list 101 deny ip host 10.1.1.1 host 10.2.2.2
R1(config)#access-list 101 deny tcp 10.1.1.0 0.0.0.255 any eq 23
R1(config)#access-list 101 deny icmp 10.1.1.1 0.0.0.0 any
Extended ACL number ranges: 100 – 199 and 2000 – 2699.
###  	R1(config)# ip access-list standard MY_STANDARD_ACL
R1(config-std-nacl)# permit 10.1.1.0 0.0.0.255
R1(config-std-nacl)# deny 10.2.2.2
R1(config-std-nacl)# permit any
### Named
### Assign
R1(config-if)# ip access-group MY_STANDARD_ACL out
### BASIC
### Passwords
(config)# enable hostname cisco
Rl(config)#line con 0
Rl(config-line)#password cisco
Rl(config-line)#login
### Username
R1(config)#username GOON_NAME privilege 15 password GOON_PASSWORD
Privilege is optional
## CDP
### Everywhere
SW1(config)#cdp run
### Interface
SW1(config-if)#no cdp enable
### Troubleshooting
SW1#show cdp neighbors
SW1#show cdp neighbors detail
SW1#show cdp entry *
SW1#show cdp entry SW1
## DHCP
R1(config)#ip dhcp pool MY_POOL
R1(dhcp-config)#network 192.168.1.0 255.255.255.0 
R1(dhcp-config)#default-router 192.168.1.1
R1(dhcp-config)#dns-server 213.131.65.20 8.8.8.8
R1(dhcp-config)#lease 2 (OPTIONAL AND IN DAYS)
R1(config)#ip dhcp excluded-address 192.168.1.1 192.168.1.100
R1(config)#ip dhcp excluded-address 192.168.1.200 192.168.1.254
## EIGRP
### Simple
R1(config)# router eigrp 1
R1(config-router)# network 192.168.1.0 0.0.0.255
R1(config-router)# no auto-summary
### Metric Weights
Router(config-router)# metric weights 0 1 1 1 0 0 
Negate values completley from metric
### Bandwidth
R1(config)# int s0/0
R1(config-if)# bandwidth 64
R1(config-if)# ip bandwidth-percent eigrp 10 30 
R1(config-if)# delay 10000 
### Passive-Interface
R1(config-router)# passive-interface s0 
### Summary-Address
RouterA(config-if)# ip summary-address eigrp 10 66.0.0.0 255.0.0.0 
### Authentication
R1(config)# key chain MYCHAIN
R1(config-keychain)# key 1
R1(config-keychain-key)# key-string MYPASSWORD
R1(config-if)# ip authentication key-chain eigrp 10 MYCHAIN
### Equal-Cost
R1(config)# router eigrp 10
R1(config-router)# variance 2
R1(config-router)# maximum-paths 6
### Stub
R1(config)# router eigrp 10
R1(config-router)# eigrp stub connected|receive-only|connected|static|summary
### Troubleshooting
show ip eigrp topology (all-links)
show ip eigrp traffic
show ip eigrp neighbor
## OSPF
### Simple
R1(config)# router ospf 1
R1(config-router)# network 172.16.1.2 0.0.0.0 area 1
R1(config-router)# network 172.17.1.1 0.0.0.0 area 0
### Timers
R1(config-if)# ip ospf hello-interval 15
R1(config-if)# ip ospf dead-interval 60 
### Metrics
(config-if)# bandwidth 64
(config-if)#ip ospf cost 5
(config-if)# ospf auto-cost reference-bandwidth 100
### Passive-Interface
R1(config-router)# passive-interface default
R1(config-router)# no passive-interface e0
### Virtual Link
R1(config-router)# area 1 virtual-link 3.3.3.3 
### Summary
R1(config-router)# area 1 range 10.1.0.0 255.255.248.0 
External
Redistribution
R1(config-router)# summary-address 15.0.0.0 255.252.0.0 
Internal
Redistribution
R1(config-router)# area 1 range 10.1.0.0 255.255.248.0 
### Stub
R1(config-router)# area 1 stub
R1(config-router)# area 1 stub no-summary
R1(config-router)# area 1 nssa
R1(config-router)# area 1 nssa no-summary
Aside: Stub puts in 0.0.0.0 route IN routint table. Totally Stub doesn't even have that in routing table, as it's just gateway of last resort.
### Default Originate
R1(config-router)# default-information originate 
R1(config-router)# default-information originate always
(FORCES THE ISSUE if no route already exists)
### Troubleshooting
R1# show ip ospf database
R1# show ip ospf
R1# show ip protocols
R1# show ip ospf neighbors
R1# show ip ospf 1
R1# show ip ospf interface e0
R1# show ip ospf process
R1# show ip ospf virtual-links
R1# show ip ospf border-routers
## BGP
### Simple
RouterB(config)# router bgp 100
RouterB(config-router)# neighbor 172.16.1.2 remote-as 900
RouterB(config-router)# neighbor 172.16.1.2 update-source lo0
RouterC(config-router)# neighbor 172.16.1.2 ebgp-multihop 2
RouterB(config-router)# neighbor 172.16.1.2 password GOON
RouterB(config-router)# timers bgp 30 90 
RouterB(config-router)# neighbor 172.16.1.2 timers 30 90 
### Address Family (MP-BGP)
router bgp 100
no synchronization
bgp log-neighbor-changes
neighbor 4 4.4.4 remote-as 100
neighbor 4.4.4.4 update-source lo0
address-family vpnv4
neighbor 4.4.4.4 activate
neighbor 4.4.4.4 send-community extended
address-family ipv4 VRF goon
neighbor 4.4.4.4 activate
neighbor 4.4.4.4 remote-as 10
### Synchronization
R1(config-rou)#no synchronization
Synchronization is default. This means that route inside of iBGP should be present in routing tables in the path, so it knows how to get to route advertized in BGP along path.
### Route Reflector
R1(config-router)# neighbor 10.2.1.2 route-reflector-client
### Confederation
R1(config-router)# bgp confederation identifier 300
R1(config-router)# bgp confederation peer 777
### Peer Group
R1(config)# router bgp 200
R1(config-router)# neighbor GOON_PEER_GROUP peer-group
R1(config-router)# neighbor GOON_PEER_GROUP remote-as 200
R1(config-router)# neighbor GOON_PEER_GROUP ebgp-multihop 2
R1(config-router)# neighbor GOON_PEER_GROUP update-source lo0
R1(config-router)# neighbor GOON_PEER_GROUP route-reflector-client
R1(config-router)# neighbor 10.10.1.1 peer-group GOON_PEER_GROUP
R1(config-router)# neighbor 10.10.2.2 peer-group GOON_PEER_GROUP
R1(config-router)# neighbor 10.10.3.3 peer-group GOON_PEER_GROUP 
### Weight
R1(config)# neighbor 10.1.1.2 R1 200
-OR- 
R1(config)# ip prefix-list GOON_PREFIX_LIWT 192.168.1.0/24
R1(config)# route-map GOON_ROUTE_MAP_R1 permit 10
R1(config-route-map)# match ip address prefix-list GOON_PREFIX_R1
R1(config-route-map)# set R1 200
R1(config-route-map)# route-map GOON_ROUTE_MAP_R1 permit 20
R1(config)# router bgp 100
R1(config)# neighbor 10.1.1.2 route-map GOON_ROUTE_MAP_R1 in 
### Local Preference
RouterD(config-router)# bgp default local-GOON_ROUTE_MAP_PREFERENCE 300 
RouterD(config)# ip prefix-list GOON_PREFIX_LIST 192.168.1.0/24
RouterD(config)# route-map GOON_ROUTE_MAP_PREFERENCE permit 10
RouterD(config-route-map)# match ip address prefix-list GOON_PREFIX_LIST
RouterD(config-route-map)# set local-preference 300
RouterD(config)# router bgp 10
RouterD(config)# neighbor 172.17.1.2 route-map GOON_ROUTE_MAP_PREFERENCE in
### MED
R1(config)# access-list 5 permit 10.5.0.0 0.0.255.255
R1(config)# route-map GOON_RM_MED permit 10
R1(config-route-map)# match ip address 5
R1(config-route-map)# set metric 200
R1(config)# router bgp 100
R1(config-router)# neighbor 172.16.1.2 route-map GOON_RM_MED out
NOTE: Note the "out" in metric, instead of "in" with weight & local preference
R1(config-router)# bgp always-compare-med
R1(config-router)# bgp deterministic-med
### Communities
R1(config)# access-list 5 permit 10.5.0.0 0.0.255.255
R1(config)# route-map RM_COMMUNITY permit 10
R1(config-route-map)# match ip address 5
R1(config-route-map)# set community no-export|no-advertise|internet|local-as
R1(config)# route-map RM_COMMUNITY permit 20
R1(config)# router bgp 100
R1(config-router)# neighbor 172.16.1.2 send-community
R1(config-router)# neighbor 172.16.1.2 route-map RM_COMMUNITY out
### Summarization
REDISTRIBUTED routes in BGP are automatically summarized.
R1(config-R1)# no auto-summary
R1(config-R1)# aggregate-address 172.16.0.0 255.255.252.0
R1(config-R1)# aggregate-address 172.16.0.0 255.255.252.0 summary-only 
### Dampening
#Route Map under relevent prefix
Router(config-route-map)# set dampening 15 750 2000 60 
Router(config-router)# bgp dampening route-map MYMAP 
### Next Hop Self
R1(config-router)# neighbor 10.2.1.2 next-hop-self 
### Distance
Router(config-router)# distance bgp 150 210 210
-OR-
Router(config-router)# network 10.5.0.0 mask 255.255.0.0 backdoor 
(Changes distance from 20 to 200)
### Maximum Prefixes
Router(config-router)# neighbor 10.1.1.1 maximum-prefix 10000
### Reset
R1# clear ip bgp *
R1# clear ip bgp * soft
### Troubleshooting
Router# show ip bgp
Router# show ip bgp summary
## QoS
### Class-Map
R1(config)# class-map match-any HICLASS
R1(config-cmap)# match input-interface fastethernet0/0
R1(config-cmap)# match ip precedence 4
R1(config-cmap)# match ip dscp af21
R1(config-cmap)# match any 
### Policy-Map
R1(config)# policy-map THEPOLICY
R1(config-pmap)# class LOWCLASS
R1(config-pmap-c)# set ip precedence 1
R1(config-pmap-c)# bandwidth 64
R1(config-pmap-c)# queue-limit 40
R1(config-pmap-c)# random-detect 
### Service-Policy
R1(config)# int fa0/0
R1(config-if)# service-policy input THEPOLICY
### Troubleshooting
show class-map
show policy-map
show policy-map interface fastethernet0/1 
## MPLS
### JUNIPER
ping
traceroute
show system uptime
show cassis environment
show cli history
show system statistics
show log
show system processes
show configuration
request support information
show system users
show version
shwo arp
show interfaces
show interfaces detail
show interfacs extensive
show interfaces terse
show route
show route summary
show policy
show system connectionsclear interface statistics
clear arp
show route protocol bgp
show route community
show
route damping decayed
show bgp neighbor
show route advertising-protocol bgp
address
show route receive-protocol bgp address
show bgp group
show route aspath-regex
show bgp summary
clear bgp neighbor
clear bgp damping
show ospf database
show ospf interface
show neighbor
## Layer 2 Security
### DHCP Snooping
Run
Switch(config)# ip dhcp snooping vlan 1
Troubleshooting
Router(config)# show ip dhcp snooping database|binding|statistics
-OR-
Router(config)# show ip source binding
### Dynamic ARP Inspection
Run
Router(config)#) ip arp inspection vlan 1
Router(config-if)# ip arp inspection trust
Troubleshooting
Router#show ip arp inspection interfaces
Router#show ip arp inspection vlan
Router#show arp access-list
### IP Source Guard
Run
Router(config-if)# ip verify source
## VRF
### Simple
Router(config)# ip vrf customer_a
Router(config-vrf)# rd 1:1
Router(config-vrf)# route-target export|import|both 1:1
Router(config)# interface fastEthernet 0.1
Router(config-subif)# ip vrf forwarding customer_a
## MPLS
### Run CEF
Start CEF
-GLOBAL-
Router(config)# ip cef
Router(config)# interface serial0/0
-OR IN INTERFACE-
Router(config-if)# ip route-cache cef
### Initalize
Router(config)# interface serial0/0
Router(config-if)# mpls ip
-OPTIONAL-
Router(config-if)# mpls label protocol ldp|tdp|both
-DEFAULT IS TDP-
### MTU
Router(config-if)# mpls mtu 1504 
(4 extra bytes, 32 extra bits for each label)
### Range
Switch(config)# mpls label range 200 4000
### Restart
Router(config)# mpls ldp graceful-restart
### Troubleshooting
R1# show mpls ldp binding
-Not used much, this is the RIB equivalent to CEF-
R1# show mpls ldp neighbor
R1# show mpls interface
R1# show mpls forwarding-table
-Shows labels & interfaces. Has detail option-
### Multicast
### Activate
S1(config)# ip multicast-routing 
### IGMP
S1(config-if)# ip igmp join-group 226.1.5.10
### RP
S1(config)# ip pim rp-address 192.168.1.1 
### Candidate RP
S1(config)# ip pim rp-candidate 4.4.4.4
S1(config)# ip pim bsr-candidate 4.4.4.4
### Mapping Agent
S1(config)# ip pim send-rp-discovery scope 10
### Sparse Mode
S1(config-if)# ip pim sparse-mode 
### Filter Sources
R1# ip pim accept-register {list GOON_STANDARD_ACL | route-map GOON_RM_FILTER_SOURCE}
### PIM Query Interval
R1(config-if)# ip pim query-interval 1
1 is in minutes
has msec option if under a second
### Troubleshooting
R1# show ip mroute
R1# show ip mroute 224.0.0.1
### Prefix List
R1# ip prefix-list GOON_PREFIX_LIST 192.168.0.16/28 ge 30 le 32
### Route Map
### Match
R1(config)# route-map MYMAP permit 10
R1(config-route-map)# match ip address 1
R1(config-route-map)# match interface serial0/0
R1(config-route-map)# match ip address prefix-list MYLIST
R1(config-route-map)# match ip next-hop 192.168.1.2
R1(config-route-map)# match metric 40
R1(config-route-map)# match route-type internal
R1(config-route-map)# match tag 33
R1(config-route-map)# match community 123
### Set
R1(config)# route-map MYMAP permit 10
R1(config-route-map)# set interface fastethernet0/1
R1(config-route-map)# set ip next-hop 10.1.1.1
R1(config-route-map)# set metric 200
R1(config-route-map)# set tag 44
R1(config-route-map)# set community 321
R1(config-route-map)# set local-preference 250
R1(config-route-map)# set weight 300
R1(config-route-map)# set ip precedence 2
### Prefix List
Router(config)# ip prefix-list MYLIST 10.1.1.0/24 ge 26 le 30 
## Route Redistribution
### RIP
R1(config)# router rip
R1(config-router)# network 172.16.0.0
R1(config-router)# redistribute igrp 10 metric 2 
### EIGRP
R1(config)# router eigrp 15
R1(config-router)# redistribute ospf 20 metric 10000 1000 255 1 1500
R1(config)# router eigrp 15
R1(config-router)# redistribute ospf 20
R1(config-router)# default-metric 10000 1000 255 1 1500
### OSPF
R1(config)# router ospf 20
R1(config-router)# redistribute eigrp 15 subnets metric-type 1 
### Tagging
#Route Tag matches on routes
RouterC(config-route-map)# set tag 44
RouterC(config)# redistribute ospf 20 route-map GOON_RM_TAG
### Switch Security
### Arp Inspection
Global
Switch(config)# ip arp inspection vlan 100 
Interface
Switch(config-if)# ip arp inspection trust
Static MAC-To-IP
Switch(config)# arp access-list DAI_LIST
Switch(config-acl)# permit ip host 10.1.1.5 mac host 000a.1111.2222
Switch(config-acl)# permit ip host 10.1.1.6 mac host 000b.3333.4444
Switch(config)# ip arp inspection filter DAI_LIST vlan 100 
### Max
### SPAN
### Source
Each listen to different parts of the Interfaces, can be placed independently (outbound/inbount)
Switch(config)# monitor session 1 source interface gi0/10 rx
Switch(config)# monitor session 1 source interface gi0/11 tx
Switch(config)# monitor session 1 source vlan 100 both 
### Filter
Switch(config)# monitor session 1 filter vlan 1-5
### Destination
Switch(config)# monitor session 1 destination interface gi0/15 
### Troubleshooting
show monitor session 1 
### RSPAN
IN SOURCE
### SwitchA(config)# monitor session 1 source interface gi0/10
SwitchA(config)# monitor session 1 destination vlan 200
### IN DESTINATION
### SwitchC(config)# monitor session 1 source vlan 200
SwitchC(config)# monitor session 1 destination interface gi0/11
### FHRP
### HSRP	
SwitchA(config)# interface vlan 100
SwitchA(config-if)# ip address 10.1.1.2 255.255.255.0
SwitchA(config-if)# standby 1 ip 10.1.1.1
SwitchB(config-if)# standby 1 ip 10.1.1.5 secondary
SwitchB(config-if)# standby 1 preempt
SwitchB(config-if)# standby 1 preempt delay 10 
Switch(config-if)# standby 1 preempt reload 20 
SW1(config-if)# standby 1 timers 4 12
SW1(config-if)# standby 1 timers msec 800 msec 2400 
SW1(config)#standby 1 track gi2/23 60 
### VRRP
SW1(config)# interface vlan 100
SW1(config-if)# ip address 10.1.1.3 255.255.255.0
SW1(config-if)# vrrp 1 priority 150
SW1(config-if)# vrrp 1 authentication STAYOUT
SW1(config-if)# vrrp 1 ip 10.1.1.1 
Note: Preemption is VRRP default
### GLBP
SW1(config)# interface gi2/22
SW1(config-if)# glbp 1 priority 150
SW1(config-if)# glbp 1 preempt
SW1(config-if)# glbp 1 ip 10.1.1.1 
SwitchB(config-if)# glbp 1 weighting 150
SwitchB(config-if)# glbp 1 weighting track 10 decrement 65 
SwitchB(config-if)# glbp 1 weighting 150 lower 90 upper 125 
SwitchB(config-if)# glbp 1 load-balancing round-robin|weighted|host-dependent
### Troubleshooting
show standby
show vrrp
show glbp
### Ether-Channel
### Load Balancing
Router(config)# port-channel load-balance src-dst-ip
src-dst-mac, src-dst-port, src-ip, src-mac, src-port are other options
### LACP
SW1(config)# interface range gi2/23 – 24
SW1(config-if)# channel-protocol lacp
SW1(config-if)# channel-group 1 mode active
SW1(config-if)# channel-group 1 mode passive 
### Pagp
SW1(config)# interface range gi2/23 – 24
SW1(config-if)# channel-protocol pagp
SW1(config-if)# channel-group 1 mode desirable
SW1(config-if)# channel-group 1 mode auto
### Port Priority
Switch(config)# interface range gi2/23 – 24
Switch(config-if)# lacp port-priority 100
### Troubleshooting
Switch# show etherchannel summary 
### L3 EtherChannel
Router(config)# interface range fastethernet 5/6 -7
Router(config-if)# channel-group 2 mode desirable
### Port Security
### Commands
SW1(config-if)#switchport port-security
SW1(config-if)#switchport port-security mac-address sticky
SW1(config-if)#switchport port-security maximum 1
SW1(config-if)#switchport port-security violation shutdown
### Troubleshooting
show port-security interface f0/6
## VLANs
### Access
SW1(config-if)# switchport mode access
### Trunk
SW1(config-if)# switchport mode trunk 
SW1(config-if)# switchport trunk allowed vlan add 10,11,12
"Add" could be substituted with Except|Remove.
Except means ALL Vlans except the list
Remove will remove from existing list
### SLA
### Simple
Router(config)#ip sla auto template type ip icmp-jitter 1
Router(config-tplt-icmp-jtr)#parameters
Router(config-icmp-jtr-params)#interval 30
Router(config-icmp-jtr-params)#end
### Scheduled
ip sla 99
udp-jitter 172.29.139.134 dest-port 5000 num-packets 20
!
ip sla schedule 99 life 300 start-time after 00:05:00
### STP
### Root Bridge
SW1(config)#spanning-tree vlan 1 root primary
SW1(config)#spanning-tree vlan 1 root secondary
SW1(config)#spanning-tree [vlan 1] priority 8192
### Mode
SW1(config)#spanning-tree mode rapid-pvst (options: mst, pvst, rapid-pvst)
### MST
SW1#spanning-tree mst configuration
SW1#name MYMSTNAME
SW1#revision 2
SW1#instance 2 vlan 1-100
SW1#instance 3 vlan 101-200
### Optimizaitons
SW1(config-if)#spanning-tree portfast
SW1(config-if)#spanning-tree bpduguard enable
SW1(config-if)#spanning-tree bpdufilter enable 
SW1(config-if)#spanning-tree guard root 
SW1(config-if)#spanning-tree guard loop 
### CONFIG MODE:
SW1(config)#spanning-tree loopguard default
SW1(config)#spanning-tree portfast bpduguard default
SW1(config)#spanning-tree portfast bpdufilter default
SwitchD(config)# spanning-tree portfast default 
Uplink Fast only in config mode:
Switch(config)# spanning-tree uplinkfast
Switch(config)# spanning-tree backbonefast
(Backbone Fast)
Switch(config)# spanning-tree backbonefast
(BPDUFilter)
SW1(config)#spanning-tree portfast bpdufilter default
SW1(config-if)#spanning-tree bpdufilter enable 
(BPDUGuard)
SW1(config)#spanning-tree portfast bpduguard default
SW1(config-if)#spanning-tree bpduguard enable
(Loop Guard)
SW1(config)#spanning-tree loopguard default
SW1(config-if)# spanning-tree guard loop
(Root Guard)
Switch(config-if)# spanning-tree guard root 
(Portfast)
SwitchD(config)# spanning-tree portfast default 
SW1(config-if)#spanning-tree portfast
(UplinkFast)
SW1(config)# spanning-tree uplinkfast
### Troubleshooting
SW1#show spanning-tree
SW1#show spanning-tree interface gi2/24 
## VXLAN
### Spine
Set up an IGP like OSPF
### Leaf (without multicast for BUM traffic (Broadcast, Unicast, Multicast))
Set up an IGP like OSPF
SW1(config)#int vxlan 1 
SW1(config-if-vx1)#vxlan source-interface lo0
</br>
------ Source is a loopback like 7.7.7.7
</br>
SW1(config-if-vx1)#vxlan vlan 3 vni 3000
SW1(config-if-vx1)#vxlan flood vtep 3.3.3.3
</br>
------ You flood to other leaf switches with same VLANs/VXLANS if not using Multicast
</br>
SW1(config)#int vlan 3
SW1(config)#ip add virtual 192.168.3.254 255.255.255.0
</br>
------ This is the default gateway
</br>
SW1(config)#vlan 11
SW1(config)#vn-segment 100011
### Leaf (EVPN L2VPN)
SW1(config)#int nve1 
(network virtual endpoint)
SW1(config-if-nve)#source-interface f01
SW1(config-if-nve)#host-reachability protocol bgp
SW1(config-if-nve)#member vni 100022
SW1(config-if-nve-vni)#mcast-group 239.0.0.1
(doesn't really mattern for BGP)
(multicast is confusing)
SW1(config)#evpn
SW1(config-evpn)#vni 100011 l2
SW1(config-evpn-evi)#rd auto
SW1(config-evpn-evi)#route-target import auto
SW1(config-evpn-evi)#route-target export auto
### Leaf (Multicast)
SW1(config)#member vni 100011
SW1(config)#mcast-group 239.0.0.1
### VXLAN (Read L2VPN routes)
SW1#show bgp l2vpn evpn neighbors 10.1.1.2 advertised-routes
### Types Of VXLAN
Multicast (Data-Plane pertaining to ARP)
Ingress Replication (BGP Control Plane) 
### JUNIPER VXLAN
1  set interfaces lo0 unit 0 family inet address 10.1.1.1
2  set switch-options vtep-source-interface lo0.0
3  set protocols pim interface lo0.0
4  set protocols pim interface xe-0/0/0.0
5  set protocols pim rp static address 10.2.2.2
6  set protocols ospf area 0.0.0.0 interface lo0.0
7  set protocols ospf area 0.0.0.0 interface xe-0/0/0.0
8  set vlans VLAN1 vlan-id 100 vxlan vni 100 multicast-group 233.252.0.2
9  set vlans VLAN1 vxlan encapsulate-inner-vlan
10 set vlans VLAN1 vxlan unreachable-vtep-aging-timer 600
11 set protocols l2-learning decapsulate-accept-inner-vlan
12 set interfaces xe-0/0/0 unit 0 family inet address 10.2.2.100/24
13 set interfaces xe-0/0/1 unit 0 family ethernet-switching interface-mode trunk
14 set interfaces xe-0/0/1 unit 0 family ethernet-switching vlan members all
15 set protocols ospf enable
16 set protocols ospf area 0.0.0.0 interface em0.0 disable
17 set protocols ospf area 0.0.0.0 interface all
</br>
Takeaways:
2 = NVE or VTEP needs to have a source interface that's a Loopback, just like Cisco
8 = Key. Makes a VLAN that has a VXLAN VNI and a multicast address, just like in other VXLANS

# <h1 id="assembly">Assembly</h1>
Hex Opcode|Opcode Extra|Decimal Opcode|Assembly Mnemonic|Description
-|-|-|-|-
00|r|0|ADD|Add
01|r|1|ADD|Add
02|r|2|ADD|Add
03|r|3|ADD|Add
04||4|ADD|Add
05||5|ADD|Add
06||6|PUSH|Push Word, Doubleword or Quadword Onto the Stack
07||7|POP|Pop a Value from the Stack
08|r|8|OR|Logical Inclusive OR
09|r|9|OR|Logical Inclusive OR
0A|r|10|OR|Logical Inclusive OR
0B|r|11|OR|Logical Inclusive OR
0C||12|OR|Logical Inclusive OR
0D||13|OR|Logical Inclusive OR
0E||14|PUSH|Push Word, Doubleword or Quadword Onto the Stack
10|r|16|ADC|Add with Carry
11|r|17|ADC|Add with Carry
12|r|18|ADC|Add with Carry
13|r|19|ADC|Add with Carry
14||20|ADC|Add with Carry
15||21|ADC|Add with Carry
16||22|PUSH|Push Word, Doubleword or Quadword Onto the Stack
17||23|POP|Pop a Value from the Stack
18|r|24|SBB|Integer Subtraction with Borrow
19|r|25|SBB|Integer Subtraction with Borrow
1A|r|26|SBB|Integer Subtraction with Borrow
1B|r|27|SBB|Integer Subtraction with Borrow
1C||28|SBB|Integer Subtraction with Borrow
1D||29|SBB|Integer Subtraction with Borrow
1E||30|PUSH|Push Word, Doubleword or Quadword Onto the Stack
1F||31|POP|Pop a Value from the Stack
20|r|32|AND|Logical AND
21|r|33|AND|Logical AND
22|r|34|AND|Logical AND
23|r|35|AND|Logical AND
24||36|AND|Logical AND
25||37|AND|Logical AND
26||38|ES|ES segment override prefix
27||39|DAA|Decimal Adjust AL after Addition
28|r|40|SUB|Subtract
29|r|41|SUB|Subtract
2A|r|42|SUB|Subtract
2B|r|43|SUB|Subtract
2C||44|SUB|Subtract
2D||45|SUB|Subtract
2E||46|CS|CS segment override prefix
2F||47|DAS|Decimal Adjust AL after Subtraction
30|r|48|XOR|Logical Exclusive OR
31|r|49|XOR|Logical Exclusive OR
32|r|50|XOR|Logical Exclusive OR
33|r|51|XOR|Logical Exclusive OR
34||52|XOR|Logical Exclusive OR
35||53|XOR|Logical Exclusive OR
36||54|SS|SS segment override prefix
37||55|AAA|ASCII Adjust After Addition
38|r|56|CMP|Compare Two Operands
39|r|57|CMP|Compare Two Operands
3A|r|58|CMP|Compare Two Operands
3B|r|59|CMP|Compare Two Operands
3C||60|CMP|Compare Two Operands
3D||61|CMP|Compare Two Operands
3E||62|DS|DS segment override prefix
3F||63|AAS|ASCII Adjust AL After Subtraction
40+r|||r16/32|
48+r|||r16/32|
50+r|||r16/32|
58+r|||r16/32|
60||96|PUSHA|Push All General-Purpose Registers
60||96|PUSHAD|Push All General-Purpose Registers
61||97|POPA|Pop All General-Purpose Registers
61||97|POPAD|Pop All General-Purpose Registers
62|r|98|BOUND|Check Array Index Against Bounds
63|r|99|ARPL|Adjust RPL Field of Segment Selector
64||100|FS|FS segment override prefix
65||101|GS|GS segment override prefix
66||102|no mnemonic|
66||102|no mnemonic|
67||103|no mnemonic|
68||104|PUSH|Push Word, Doubleword or Quadword Onto the Stack
69|r|105|IMUL|Signed Multiply
6A||106|PUSH|Push Word, Doubleword or Quadword Onto the Stack
6B|r|107|IMUL|Signed Multiply
6C||108|INS|Input from Port to String
6D||109|INS|Input from Port to String
6D||109|INS|Input from Port to String
6E||110|OUTS|Output String to Port
6F||111|OUTS|Output String to Port
6F||111|OUTS|Output String to Port
70||112|JO|Jump short if overflow (OF=1)
71||113|JNO|Jump short if not overflow (OF=0)
72||114|JB|Jump short if below/not above or equal/carry (CF=1)
73||115|JNB|Jump short if not below/above or equal/not carry (CF=0)
74||116|JZ|Jump short if zero/equal (ZF=1)
75||117|JNZ|Jump short if not zero/not equal (ZF=0)
76||118|JBE|Jump short if below or equal/not above (CF=1 OR ZF=1)
77||119|JNBE|Jump short if not below or equal/above (CF=0 AND ZF=0)
78||120|JS|Jump short if sign (SF=1)
79||121|JNS|Jump short if not sign (SF=0)
7A||122|JP|Jump short if parity/parity even (PF=1)
7B||123|JNP|Jump short if not parity/parity odd (PF=0)
7C||124|JL|Jump short if less/not greater (SF!=OF)
7D||125|JNL|Jump short if not less/greater or equal (SF=OF)
7E||126|JLE|Jump short if less or equal/not greater ((ZF=1) OR (SF!=OF))
7F||127|JNLE|Jump short if not less nor equal/greater ((ZF=0) AND (SF=OF))
80|0|128|ADD|Add
80|1|128|OR|Logical Inclusive OR
80|2|128|ADC|Add with Carry
80|3|128|SBB|Integer Subtraction with Borrow
80|4|128|AND|Logical AND
80|5|128|SUB|Subtract
80|6|128|XOR|Logical Exclusive OR
80|7|128|CMP|Compare Two Operands
81|0|129|ADD|Add
81|1|129|OR|Logical Inclusive OR
81|2|129|ADC|Add with Carry
81|3|129|SBB|Integer Subtraction with Borrow
81|4|129|AND|Logical AND
81|5|129|SUB|Subtract
81|6|129|XOR|Logical Exclusive OR
81|7|129|CMP|Compare Two Operands
82|0|130|ADD|Add
82|1|130|OR|Logical Inclusive OR
82|2|130|ADC|Add with Carry
82|3|130|SBB|Integer Subtraction with Borrow
82|4|130|AND|Logical AND
82|5|130|SUB|Subtract
82|6|130|XOR|Logical Exclusive OR
82|7|130|CMP|Compare Two Operands
83|0|131|ADD|Add
83|1|131|OR|Logical Inclusive OR
83|2|131|ADC|Add with Carry
83|3|131|SBB|Integer Subtraction with Borrow
83|4|131|AND|Logical AND
83|5|131|SUB|Subtract
83|6|131|XOR|Logical Exclusive OR
83|7|131|CMP|Compare Two Operands
84|r|132|TEST|Logical Compare
85|r|133|TEST|Logical Compare
86|r|134|XCHG|Exchange Register/Memory with Register
87|r|135|XCHG|Exchange Register/Memory with Register
88|r|136|MOV|Move
89|r|137|MOV|Move
8A|r|138|MOV|Move
8B|r|139|MOV|Move
8C|r|140|MOV|Move
8D|r|141|LEA|Load Effective Address
8E|r|142|MOV|Move
8F|0|143|POP|Pop a Value from the Stack
90+r|||r16/32|
90||144|NOP|No Operation
90F3|||PAUSE|Spin Loop Hint
98||152|CBW|Convert Byte to Word
98||152|CWDE|Convert Word to Doubleword
99||153|CWD|Convert Word to Doubleword
99||153|CDQ|Convert Doubleword to Quadword
9A||154|CALLF|Call Procedure
9B||155|FWAIT|Check pending unmasked floating-point exceptions
9B||155|no mnemonic|
9C||156|PUSHF|Push FLAGS Register onto the Stack
9C||156|PUSHFD|Push eFLAGS Register onto the Stack
9D||157|POPF|Pop Stack into FLAGS Register
9D||157|POPFD|Pop Stack into eFLAGS Register
9E||158|SAHF|Store AH into Flags
9F||159|LAHF|Load Status Flags into AH Register
A0||160|MOV|Move
A1||161|MOV|Move
A2||162|MOV|Move
A3||163|MOV|Move
A4||164|MOVS|Move Data from String to String
A5||165|MOVS|Move Data from String to String
A5||165|MOVS|Move Data from String to String
A6||166|CMPS|Compare String Operands
A7||167|CMPS|Compare String Operands
A7||167|CMPS|Compare String Operands
A8||168|TEST|Logical Compare
A9||169|TEST|Logical Compare
AA||170|STOS|Store String
AB||171|STOS|Store String
AB||171|STOS|Store String
AC||172|LODS|Load String
AD||173|LODS|Load String
AD||173|LODS|Load String
AE||174|SCAS|Scan String
AF||175|SCAS|Scan String
AF||175|SCAS|Scan String
B0+r|||r8|
B8+r|||r16/32|
C0|0|192|ROL|Rotate
C0|1|192|ROR|Rotate
C0|2|192|RCL|Rotate
C0|3|192|RCR|Rotate
C0|4|192|SHL|Shift
C0|5|192|SHR|Shift
C0|6|192|SAL|Shift
C0|7|192|SAR|Shift
C1|0|193|ROL|Rotate
C1|1|193|ROR|Rotate
C1|2|193|RCL|Rotate
C1|3|193|RCR|Rotate
C1|4|193|SHL|Shift
C1|5|193|SHR|Shift
C1|6|193|SAL|Shift
C1|7|193|SAR|Shift
C2||194|RETN|Return from procedure
C3||195|RETN|Return from procedure
C4|r|196|LES|Load Far Pointer
C5|r|197|LDS|Load Far Pointer
C6|0|198|MOV|Move
C7|0|199|MOV|Move
C8||200|ENTER|Make Stack Frame for Procedure Parameters
C9||201|LEAVE|High Level Procedure Exit
CA||202|RETF|Return from procedure
CB||203|RETF|Return from procedure
CC||204|INT|Call to Interrupt Procedure
CD||205|INT|Call to Interrupt Procedure
CE||206|INTO|Call to Interrupt Procedure
CF||207|IRET|Interrupt Return
CF||207|IRETD|Interrupt Return
D0|0|208|ROL|Rotate
D0|1|208|ROR|Rotate
D0|2|208|RCL|Rotate
D0|3|208|RCR|Rotate
D0|4|208|SHL|Shift
D0|5|208|SHR|Shift
D0|6|208|SAL|Shift
D0|7|208|SAR|Shift
D1|0|209|ROL|Rotate
D1|1|209|ROR|Rotate
D1|2|209|RCL|Rotate
D1|3|209|RCR|Rotate
D1|4|209|SHL|Shift
D1|5|209|SHR|Shift
D1|6|209|SAL|Shift
D1|7|209|SAR|Shift
D2|0|210|ROL|Rotate
D2|1|210|ROR|Rotate
D2|2|210|RCL|Rotate
D2|3|210|RCR|Rotate
D2|4|210|SHL|Shift
D2|5|210|SHR|Shift
D2|6|210|SAL|Shift
D2|7|210|SAR|Shift
D3|0|211|ROL|Rotate
D3|1|211|ROR|Rotate
D3|2|211|RCL|Rotate
D3|3|211|RCR|Rotate
D3|4|211|SHL|Shift
D3|5|211|SHR|Shift
D3|6|211|SAL|Shift
D3|7|211|SAR|Shift
D4|0A|212|AAM|ASCII Adjust AX After Multiply
D4||212|AMX|Adjust AX After Multiply
D5|0A|213|AAD|ASCII Adjust AX Before Division
D5||213|ADX|Adjust AX Before Division
D6||214|undefined|
D6||214|SALC|Set AL If Carry
D7||215|XLAT|Table Look-up Translation
D8|0|216|FADD|Add
D8|1|216|FMUL|Multiply
D8|2|216|FCOM|Compare Real
D8|D1 2|216|FCOM|Compare Real
D8|3|216|FCOMP|Compare Real and Pop
D8|D9 3|216|FCOMP|Compare Real and Pop
D8|4|216|FSUB|Subtract
D8|5|216|FSUBR|Reverse Subtract
D8|6|216|FDIV|Divide
D8|7|216|FDIVR|Reverse Divide
D9|0|217|FLD|Load Floating Point Value
D9|1|217|FXCH|Exchange Register Contents
D9|C9 1|217|FXCH|Exchange Register Contents
D9|2|217|FST|Store Floating Point Value
D9|D0 2|217|FNOP|No Operation
D9|3|217|FSTP|Store Floating Point Value and Pop
D9|3|217|FSTP1|Store Floating Point Value and Pop
D9|4|217|FLDENV|Load x87 FPU Environment
D9|E0 4|217|FCHS|Change Sign
D9|E1 4|217|FABS|Absolute Value
D9|E4 4|217|FTST|Test
D9|E5 4|217|FXAM|Examine
D9|5|217|FLDCW|Load x87 FPU Control Word
D9|E8 5|217|FLD1|Load Constant +1
D9|E9 5|217|FLDL2T|Load Constant log210
D9|EA 5|217|FLDL2E|Load Constant log2e
D9|EB 5|217|FLDPI|Load Constant π
D9|EC 5|217|FLDLG2|Load Constant log102
D9|ED 5|217|FLDLN2|Load Constant loge2
D9|EE 5|217|FLDZ|Load Constant +0
D9|6|217|FNSTENV|Store x87 FPU Environment
D99B|6||FSTENV|Store x87 FPU Environment
D9|F0 6|217|F2XM1|Compute 2x-1
D9|F1 6|217|FYL2X|Compute y ? log2x and Pop
D9|F2 6|217|FPTAN|Partial Tangent
D9|F3 6|217|FPATAN|Partial Arctangent and Pop
D9|F4 6|217|FXTRACT|Extract Exponent and Significand
D9|F5 6|217|FPREM1|IEEE Partial Remainder
D9|F6 6|217|FDECSTP|Decrement Stack-Top Pointer
D9|F7 6|217|FINCSTP|Increment Stack-Top Pointer
D9|7|217|FNSTCW|Store x87 FPU Control Word
D99B|7||FSTCW|Store x87 FPU Control Word
D9|F8 7|217|FPREM|Partial Remainder (for compatibility with i8087 and i287)
D9|F9 7|217|FYL2XP1|Compute y ? log2(x+1) and Pop
D9|FA 7|217|FSQRT|Square Root
D9|FB 7|217|FSINCOS|Sine and Cosine
D9|FC 7|217|FRNDINT|Round to Integer
D9|FD 7|217|FSCALE|Scale
D9|FE 7|217|FSIN|Sine
D9|FF 7|217|FCOS|Cosine
DA|0|218|FIADD|Add
DA|0|218|FCMOVB|FP Conditional Move - below (CF=1)
DA|1|218|FIMUL|Multiply
DA|1|218|FCMOVE|FP Conditional Move - equal (ZF=1)
DA|2|218|FICOM|Compare Integer
DA|2|218|FCMOVBE|FP Conditional Move - below or equal (CF=1 or ZF=1)
DA|3|218|FICOMP|Compare Integer and Pop
DA|3|218|FCMOVU|FP Conditional Move - unordered (PF=1)
DA|4|218|FISUB|Subtract
DA|5|218|FISUBR|Reverse Subtract
DA|E9 5|218|FUCOMPP|Unordered Compare Floating Point Values and Pop Twice
DA|6|218|FIDIV|Divide
DA|7|218|FIDIVR|Reverse Divide
DB|0|219|FILD|Load Integer
DB|0|219|FCMOVNB|FP Conditional Move - not below (CF=0)
DB|1|219|FISTTP|Store Integer with Truncation and Pop
DB|1|219|FCMOVNE|FP Conditional Move - not equal (ZF=0)
DB|2|219|FIST|Store Integer
DB|2|219|FCMOVNBE|FP Conditional Move - below or equal (CF=0 and ZF=0)
DB|3|219|FISTP|Store Integer and Pop
DB|3|219|FCMOVNU|FP Conditional Move - not unordered (PF=0)
DB|E0 4|219|FNENI nop|Treated as Integer NOP
DB|E1 4|219|FNDISI nop|Treated as Integer NOP
DB|E2 4|219|FNCLEX|Clear Exceptions
DB9B|E2 4||FCLEX|Clear Exceptions
DB|E3 4|219|FNINIT|Initialize Floating-Point Unit
DB9B|E3 4||FINIT|Initialize Floating-Point Unit
DB|E4 4|219|FNSETPM nop|Treated as Integer NOP
DB|5|219|FLD|Load Floating Point Value
DB|5|219|FUCOMI|Unordered Compare Floating Point Values and Set EFLAGS
DB|6|219|FCOMI|Compare Floating Point Values and Set EFLAGS
DB|7|219|FSTP|Store Floating Point Value and Pop
DC|0|220|FADD|Add
DC|0|220|FADD|Add
DC|1|220|FMUL|Multiply
DC|1|220|FMUL|Multiply
DC|2|220|FCOM|Compare Real
DC|2|220|FCOM2|Compare Real
DC|3|220|FCOMP|Compare Real and Pop
DC|3|220|FCOMP3|Compare Real and Pop
DC|4|220|FSUB|Subtract
DC|4|220|FSUBR|Reverse Subtract
DC|5|220|FSUBR|Reverse Subtract
DC|5|220|FSUB|Subtract
DC|6|220|FDIV|Divide
DC|6|220|FDIVR|Reverse Divide
DC|7|220|FDIVR|Reverse Divide
DC|7|220|FDIV|Divide and Pop
DD|0|221|FLD|Load Floating Point Value
DD|0|221|FFREE|Free Floating-Point Register
DD|1|221|FISTTP|Store Integer with Truncation and Pop
DD|1|221|FXCH4|Exchange Register Contents
DD|2|221|FST|Store Floating Point Value
DD|2|221|FST|Store Floating Point Value
DD|3|221|FSTP|Store Floating Point Value and Pop
DD|3|221|FSTP|Store Floating Point Value and Pop
DD|4|221|FRSTOR|Restore x87 FPU State
DD|4|221|FUCOM|Unordered Compare Floating Point Values
DD|E1 4|221|FUCOM|Unordered Compare Floating Point Values
DD|5|221|FUCOMP|Unordered Compare Floating Point Values and Pop
DD|E9 5|221|FUCOMP|Unordered Compare Floating Point Values and Pop
DD|6|221|FNSAVE|Store x87 FPU State
DD9B|6||FSAVE|Store x87 FPU State
DD|7|221|FNSTSW|Store x87 FPU Status Word
DD9B|7||FSTSW|Store x87 FPU Status Word
DE|0|222|FIADD|Add
DE|0|222|FADDP|Add and Pop
DE|C1 0|222|FADDP|Add and Pop
DE|1|222|FIMUL|Multiply
DE|1|222|FMULP|Multiply and Pop
DE|C9 1|222|FMULP|Multiply and Pop
DE|2|222|FICOM|Compare Integer
DE|2|222|FCOMP5|Compare Real and Pop
DE|3|222|FICOMP|Compare Integer and Pop
DE|D9 3|222|FCOMPP|Compare Real and Pop Twice
DE|4|222|FISUB|Subtract
DE|4|222|FSUBRP|Reverse Subtract and Pop
DE|E1 4|222|FSUBRP|Reverse Subtract and Pop
DE|5|222|FISUBR|Reverse Subtract
DE|5|222|FSUBP|Subtract and Pop
DE|E9 5|222|FSUBP|Subtract and Pop
DE|6|222|FIDIV|Divide
DE|6|222|FDIVRP|Reverse Divide and Pop
DE|F1 6|222|FDIVRP|Reverse Divide and Pop
DE|7|222|FIDIVR|Reverse Divide
DE|7|222|FDIVP|Divide and Pop
DE|F9 7|222|FDIVP|Divide and Pop
DF|0|223|FILD|Load Integer
DF|0|223|FFREEP|Free Floating-Point Register and Pop
DF|1|223|FISTTP|Store Integer with Truncation and Pop
DF|1|223|FXCH7|Exchange Register Contents
DF|2|223|FIST|Store Integer
DF|2|223|FSTP8|Store Floating Point Value and Pop
DF|3|223|FISTP|Store Integer and Pop
DF|3|223|FSTP9|Store Floating Point Value and Pop
DF|4|223|FBLD|Load Binary Coded Decimal
DF|E0 4|223|FNSTSW|Store x87 FPU Status Word
DF9B|E0 4||FSTSW|Store x87 FPU Status Word
DF|5|223|FILD|Load Integer
DF|5|223|FUCOMIP|Unordered Compare Floating Point Values and Set EFLAGS and Pop
DF|6|223|FBSTP|Store BCD Integer and Pop
DF|6|223|FCOMIP|Compare Floating Point Values and Set EFLAGS and Pop
DF|7|223|FISTP|Store Integer and Pop
E0||224|LOOPNZ|Decrement count; Jump short if count!=0 and ZF=0
E1||225|LOOPZ|Decrement count; Jump short if count!=0 and ZF=1
E2||226|LOOP|Decrement count; Jump short if count!=0
E3||227|JCXZ|Jump short if eCX register is 0
E4||228|IN|Input from Port
E5||229|IN|Input from Port
E6||230|OUT|Output to Port
E7||231|OUT|Output to Port
E8||232|CALL|Call Procedure
E9||233|JMP|Jump
EA||234|JMPF|Jump
EB||235|JMP|Jump
EC||236|IN|Input from Port
ED||237|IN|Input from Port
EE||238|OUT|Output to Port
EF||239|OUT|Output to Port
F0||240|LOCK|Assert LOCK# Signal Prefix
F1||241|undefined|
F1||241|INT1|Call to Interrupt Procedure
F2||242|REPNZ|Repeat String Operation Prefix
F2||242|REP|Repeat String Operation Prefix
F2||242|no mnemonic|
F3||243|REPZ|Repeat String Operation Prefix
F3||243|REP|Repeat String Operation Prefix
F3||243|no mnemonic|
F4||244|HLT|Halt
F5||245|CMC|Complement Carry Flag
F6|0|246|TEST|Logical Compare
F6|1|246|TEST|Logical Compare
F6|2|246|NOT|One's Complement Negation
F6|3|246|NEG|Two's Complement Negation
F6|4|246|MUL|Unsigned Multiply
F6|5|246|IMUL|Signed Multiply
F6|6|246|DIV|Unsigned Divide
F6|7|246|IDIV|Signed Divide
F7|0|247|TEST|Logical Compare
F7|1|247|TEST|Logical Compare
F7|2|247|NOT|One's Complement Negation
F7|3|247|NEG|Two's Complement Negation
F7|4|247|MUL|Unsigned Multiply
F7|5|247|IMUL|Signed Multiply
F7|6|247|DIV|Unsigned Divide
F7|7|247|IDIV|Signed Divide
F8||248|CLC|Clear Carry Flag
F9||249|STC|Set Carry Flag
FA||250|CLI|Clear Interrupt Flag
FB||251|STI|Set Interrupt Flag
FC||252|CLD|Clear Direction Flag
FD||253|STD|Set Direction Flag
FE|0|254|INC|Increment by 1
FE|1|254|DEC|Decrement by 1
FF|0|255|INC|Increment by 1
FF|1|255|DEC|Decrement by 1
FF|2|255|CALL|Call Procedure
FF|3|255|CALLF|Call Procedure
FF|4|255|JMP|Jump
FF|5|255|JMPF|Jump
FF|6|255|PUSH|Push Word, Doubleword or Quadword Onto the Stack
