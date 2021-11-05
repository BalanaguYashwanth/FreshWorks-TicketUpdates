var axios = require("axios")


exports = {
  events: [
    { event: 'onAppInstall', callback: 'onInstallHandler' },
    { event: 'onAppUninstall', callback: 'onUninstallHandler' },
    { event: 'onExternalEvent', callback: 'onExternalEventHandler' },
    //{ event :'onTicketCreate', callback:'onTicketCreateCallback'}
  ],
  onInstallHandler: async function (payload) {
    try {
      const webhook = await generateTargetUrl();
      const options = {
        body: `{'webhook': ${webhook}}`,
        action: 'register'
      };
      const { response } = await $request.post(thirdPartyEndpoint, options);

      console.info('\n Webhook creation successful \n', webhook);
      console.info('\n Webhook Registration Successful \n', response);
      console.info('\n Hander received following payload when app is installed \n\n', payload);

      renderData();
    } catch (error) {
      console.error('Something went wrong. Webhook Registration has failed');
    }
  },
  onUninstallHandler: async function (payload) {
    try {
      const options = {
        action: 'de-register'
      };
      const { response } = await $request.post(thirdPartyEndpoint, options);
      console.info('\n Webhook De-Registration Successful \n', response);
      console.info('\n Hander received following payload when app is uninstalled \n\n', payload);
    } catch (error) {
      console.error('Something went wrong. Webhook De-Registration has failed', error);
    }
    renderData();
  },

  onTicketCreateCallback: async function (args) {

    await axios.get('https://api.telegram.org/bot1980004068:AAHIoWZtbNYzgV_jI_ayrVpvB9kWDzcOask/getUpdates')
      .then(res => {
        let datas = res.data.result
        for(let data in datas)
        {
          if(datas[data].message.text=='/ticketupdates')
          {
            axios.post(`https://api.telegram.org/bot1980004068:AAHIoWZtbNYzgV_jI_ayrVpvB9kWDzcOask/sendmessage?chat_id=${datas[data].message.chat.id}&text=${"NAME:-"+args["data"]["requester"]["name"]+","+"ID:-"+args["data"]["ticket"]["id"]+","+"PRIORITY:-"+args["data"]["ticket"]["priority"]+","+"SUBJECT:-"+args["data"]["ticket"]["subject"]+","+"DUEBY:-"+args["data"]["ticket"]["due_by"]}+"-For-more-information-please-connect-to-freshdesk-portal"`)
            .then(res=>console.log(res))
            .catch(err=>console.log(err))
          } 
        }
      })
      .catch(err => console.log(err))
  },

  onExternalEventHandler: function (payload) {
    const { data } = payload;
    console.info('\n Desired action occurred within 3rd party');
    console.info(' onExternalEventHandler invoked with following data: \n', data);
  }
};
