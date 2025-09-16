import { createServer } from 'node:http';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Client,
	ComponentType,
	GatewayIntentBits,
} from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const server = createServer((_req, res) => {
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({ status: 'OK', bot: client.isReady() }));
});

server.listen(port, () => {
	console.log(`Health server running on port ${port}`);
});

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
	],
});

const cooldowns = new Map<string, number>();
const spamCount = new Map<string, number>();
const COOLDOWN_TIME = 15 * 60 * 1000; // 15 minutes
const SPAM_TIMEOUT = 5 * 60 * 1000; // 5 minutes

client.once('ready', () => {
	console.log(`fenbot is ready as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'fen') {
		const userId = interaction.user.id;
		const customMessage =
			interaction.options.getString('custom_message') || 'fen';
		const now = Date.now();
		const userCooldown = cooldowns.get(userId);

		if (userCooldown && now < userCooldown) {
			const currentSpam = spamCount.get(userId) || 0;
			spamCount.set(userId, currentSpam + 1);

			if (currentSpam >= 2) {
				cooldowns.set(userId, now + SPAM_TIMEOUT);
				spamCount.delete(userId);

				try {
					const guild = await client.guilds.fetch(process.env.GUILD_ID!);
					const member = await guild.members.fetch(userId);
					await member.timeout(SPAM_TIMEOUT, 'Spam del comando fen');
					return await interaction.reply(
						`Sei un faggot, te l'avevo detto che non dovevi fennare`,
					);
				} catch (error) {
					return await interaction.reply(
						`Dioporco non ho i permessi per mettere il timeout a sto coglione: ${error}`,
					);
				}
			}

			const timeLeft = Math.ceil((userCooldown - now) / 60000);
			try {
				return await interaction.reply(
					`Non fare il Pertichini, tra ${timeLeft} minuti potrai fennare di nuovo! ||coglione||`,
				);
			} catch (error) {
				console.error(`Failed to send cooldown message: ${error}`);
				return;
			}
		}

		const guildId = process.env.GUILD_ID!;
		const roleId = process.env.ROLE_ID!;
		const channelId = process.env.CHANNEL_ID;

		try {
			await interaction.deferReply();

			cooldowns.set(userId, now + COOLDOWN_TIME);
			spamCount.delete(userId);

			const guild = await client.guilds.fetch(guildId);
			const role = await guild.roles.fetch(roleId);

			if (!role) {
				return interaction.editReply('Role not found');
			}

			const allMembers = await guild.members.fetch();

			// Get members currently connected to the voice channel to exclude them
			let voiceChannelMemberIds = new Set<string>();
			if (channelId) {
				try {
					const channel = await guild.channels.fetch(channelId);
					if (channel?.isVoiceBased()) {
						// Get members currently connected to the voice channel
						voiceChannelMemberIds = new Set(channel.members.keys());
						console.log(
							`Excluding ${voiceChannelMemberIds.size} members currently in voice channel`,
						);
					} else {
						console.warn(
							`Channel ${channelId} is not a voice channel, no members will be excluded`,
						);
					}
				} catch (error) {
					console.error(`Failed to fetch channel ${channelId}: ${error}`);
				}
			}

			const membersWithRole = allMembers.filter(
				(member) =>
					member.roles.cache.has(roleId) &&
					member.id !== userId &&
					!voiceChannelMemberIds.has(member.id),
			);

			const calledMembers: string[] = [];

			await Promise.all(
				membersWithRole.map(async (member) => {
					try {
						await member.send(
							`[${interaction.user.username}] ${customMessage}`,
						);
						calledMembers.push(member.user.tag);
					} catch (error) {
						console.error(`Non riesco a fennare ${member.user.tag}: ${error}`);
					}
				}),
			);

			const showMembersButton = new ButtonBuilder()
				.setCustomId('show_called_members')
				.setLabel('Mostra fagatrons')
				.setStyle(ButtonStyle.Secondary);

			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				showMembersButton,
			);

			const response = await interaction.editReply({
				content: `Ho fennato ${membersWithRole.size} fagatron con il ruolo ${role.name}`,
				components: [row],
			});

			// Create a collector to handle button clicks
			const collector = response.createMessageComponentCollector({
				componentType: ComponentType.Button,
				time: 300000, // 5 minutes
			});

			collector.on('collect', async (buttonInteraction) => {
				if (buttonInteraction.customId === 'show_called_members') {
					if (calledMembers.length === 0) {
						await buttonInteraction.reply({
							content: 'Nessun membro è stato fennato con successo.',
							ephemeral: true,
						});
					} else {
						const membersList = calledMembers.join('\n');
						await buttonInteraction.reply({
							content: `**Membri fennati:**\n\`\`\`\n${membersList}\n\`\`\``,
							ephemeral: true,
						});
					}
				}
			});

			collector.on('end', async () => {
				// Disable the button after 5 minutes
				const disabledButton = new ButtonBuilder()
					.setCustomId('show_called_members')
					.setLabel('Mostra chi ho chiamato')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true);

				const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
					disabledButton,
				);

				try {
					await interaction.editReply({
						content: `Ho fennato ${membersWithRole.size} fagatron con il ruolo ${role.name}`,
						components: [disabledRow],
					});
				} catch (error) {
					console.error('Failed to disable button:', error);
				}
			});
		} catch (error) {
			if (interaction.deferred) {
				await interaction.editReply(`Errore: ${(error as Error).message}`);
			} else {
				await interaction.reply(`Errore: ${(error as Error).message}`);
			}
		}
	}
});

client.login(process.env.DISCORD_TOKEN);
