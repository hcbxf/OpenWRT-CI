'use strict';
'require view';
'require fs';
'require ui';

return view.extend({
	load: function() {
		return fs.exec('/usr/sbin/wifi-power', [ 'status' ]).then(function(res) {
			return (res.stdout || '').trim() || 'off';
		}).catch(function() {
			return 'off';
		});
	},

	handleToggle: function(status) {
		var action = (status === 'on') ? 'off' : 'on';
		var btn = document.getElementById('wifi-power-toggle');

		if (btn)
			btn.disabled = true;

		return fs.exec('/usr/sbin/wifi-power', [ action ]).then(function(res) {
			if (res.code !== 0) {
				ui.addNotification(null, E('p', {}, res.stderr || _('Command failed')), 'error');
				if (btn)
					btn.disabled = false;
				return;
			}

			ui.addNotification(null, E('p', {},
				action === 'on' ? _('WiFi has been enabled.') : _('WiFi has been disabled and powered down.')),
				'info');

			window.setTimeout(function() {
				window.location.reload();
			}, 800);
		}).catch(function(err) {
			ui.addNotification(null, E('p', {}, err.message || String(err)), 'error');
			if (btn)
				btn.disabled = false;
		});
	},

	render: function(status) {
		var isOn = (status === 'on');
		var self = this;

		return E('div', { 'class': 'cbi-map' }, [
			E('h2', {}, _('WiFi Power Control')),
			E('div', { 'class': 'cbi-map-descr' },
				_('Unload the MT7915e driver to power down the MT7986 WiFi subsystem, or reload it to enable WiFi.')),

			E('div', { 'class': 'cbi-section' }, [
				E('div', { 'class': 'cbi-value' }, [
					E('label', { 'class': 'cbi-value-title' }, _('Current status')),
					E('div', { 'class': 'cbi-value-field' },
						isOn ? _('WiFi is on') : _('WiFi is off (driver unloaded)'))
				]),

				E('div', { 'class': 'cbi-value' }, [
					E('div', { 'class': 'cbi-value-field' },
						E('button', {
							'id': 'wifi-power-toggle',
							'class': 'cbi-button ' + (isOn ? 'cbi-button-reset' : 'cbi-button-apply'),
							'click': function() {
								return self.handleToggle(status);
							}
						}, isOn ? _('Turn WiFi off') : _('Turn WiFi on')))
				]),

				E('div', { 'class': 'cbi-value' }, [
					E('div', { 'class': 'cbi-value-field' },
						E('em', {}, _('Turning off adds a blacklist entry so the driver stays unloaded after reboot. Turning on removes it.')))
				])
			])
		]);
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
