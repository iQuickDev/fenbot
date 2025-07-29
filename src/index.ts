import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import { createServer } from 'http';

dotenv.config();

const port = process.env.PORT || 3000;

const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', bot: client.isReady() }));
});

server.listen(port, () => {
    console.log(`Health server running on port ${port}`);
});

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences]
});

client.once('ready', () => {
    console.log(`fenbot is ready as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    if (interaction.commandName === 'fen') {
        const guildId = process.env.GUILD_ID!;
        const roleId = process.env.ROLE_ID!;
        
        try {
            await interaction.deferReply();
            
            const guild = await client.guilds.fetch(guildId);
            const role = await guild.roles.fetch(roleId);
            
            if (!role) {
                return interaction.editReply('Role not found');
            }
            
            const allMembers = await guild.members.fetch();
            const membersWithRole = allMembers.filter(member => member.roles.cache.has(roleId));

            for (const [, member] of membersWithRole) {
                try {
                    await member.send('fen');
                } catch (error) {
                    console.log(`Non riesco a fennare ${member.user.tag}`);
                }
            }
            
            await interaction.editReply(`Ho fennato ${membersWithRole.size} fagatron con il ruolo ${role.name}`);
            
        } catch (error) {
            if (interaction.deferred) {
                await interaction.editReply('Errore: ' + (error as Error).message);
            } else {
                await interaction.reply('Errore: ' + (error as Error).message);
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);