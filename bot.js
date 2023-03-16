const Discord = require("discord.js");
const { Intents } = Discord;

const client = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

const targetChannelId = "1084424951542599760";

client.on("voiceStateUpdate", async (oldState, newState) => {
    // Überprüfe, ob der Benutzer den Ziel-Sprachkanal betritt oder verlässt
    if (
      (oldState.channelId === targetChannelId && !newState.channelId) ||
      (newState.channelId === targetChannelId && !oldState.channelId)
    ) {
      try {
        // Erstelle einen neuen Sprachkanal im selben Kategorie wie der Zielkanal
        const targetChannel = await client.channels.fetch(targetChannelId);
        const newChannel = await targetChannel.clone({ name: `${newState.member.displayName}'s Sprachkanal` });
  
        // Setze die Rechte des Benutzers, der den neuen Kanal erstellt hat
        await newChannel.permissionOverwrites.create(newState.member, {
          MANAGE_CHANNELS: true,
          MANAGE_ROLES: true,
          VIEW_CHANNEL: true,
          CONNECT: true,
          SPEAK: true,
          STREAM: true,
        });
  
        // Schiebe den Benutzer in den neuen Kanal
        await newState.member.voice.setChannel(newChannel);
  
        // Lösche den Kanal, wenn er leer ist
        const interval = setInterval(() => {
            if (newChannel.members.size === 0) {
              clearInterval(interval); // stoppe das Überprüfen, sobald der Kanal gelöscht wird
              newChannel.delete().catch(console.error); // Lösche den Kanal
            }
          }, 60000); // Überprüfe alle 60 Sekunden, ob der Kanal leer ist
      } catch (error) {
        console.error(error);
      }
    }
  });
    
client.login("");