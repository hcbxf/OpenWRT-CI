include $(TOPDIR)/rules.mk

LUCI_TITLE:=WiFi Power Control
LUCI_DESCRIPTION:=Unload or load the MT7915e driver to power down or up the MT7986 WiFi subsystem.
LUCI_DEPENDS:=+luci-base +wifi-scripts +kmod-mt7915e
LUCI_PKGARCH:=all

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
