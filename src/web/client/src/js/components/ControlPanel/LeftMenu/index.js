import { withRouter, Link } from 'react-router-dom'
import { connect, useSelector, useDispatch } from 'react-redux'
import React, { Component } from 'react'
import colors from '../../../constants/colors'
import pages from '../../../constants/pages'
import { Divider, Dropdown, Button, Popup, Icon } from 'semantic-ui-react'
import styled from 'styled-components'
import DiscordAvatar from '../utils/DiscordAvatar'
import MenuButton from './MenuButton'
import PropTypes from 'prop-types'
import { isMobile } from "react-device-detect"
import { Scrollbars } from 'react-custom-scrollbars'
import modal from '../../utils/modal'
import { getActiveFeed, getActiveFeedID } from 'js/selectors/feeds'
import { setActiveGuild } from 'js/actions/guilds'
import { setActiveFeed } from 'js/actions/feeds'
import { changePage } from 'js/actions/page'
import {
  articlesFetchErrored as articlesFetchErroredSelector,
  articlesFetching as articlesFetchingSelector
} from 'js/selectors/feeds'
// const mapStateToProps = state => {
//   return {
//     feedId: state.feedId,
//     guildId: state.guildId,
//     page: state.page,
//     user: state.user,
//     channels: state.channels,
//     feeds: state.feeds,
//     feed: state.feed,
//     guilds: state.guilds,
//     articlesFetching: state.articlesFetching,
//     articlesError: state.articlesError
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     changePage: page => dispatch(changePage(page)),
//     setActiveFeed: rssName => dispatch(setActiveFeed(rssName)),
//     setActiveGuild: guildId => dispatch(setActiveGuild(guildId)),
//   }
// }

const LeftMenuDiv = styled.div`
  display: flex;
  flex-shrink: 0;
  /* overflow-y: ${props => props.expanded ? 'auto' : 'hidden'}; */
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  width: ${props => props.expanded ? '100vw' : 0};
  transition: opacity 0.25s ease-in-out;
  /* overflow-x: hidden; */
  z-index: 100;
  background: #2f3136;
  opacity: ${props => props.expanded ? 1 : 0};
  scrollbar-width: thin;
  > div {
    width: auto;
  }
  @media screen and (min-width: 860px) {
    position: static;
    width: ${props => props.expanded ? '350px' : 0};
    > div {
      width: auto;
    }
  }
`

const Header = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 30px;
  &:hover {
    text-decoration: none;
  }
  /* display: flex;
  align-items: center; */
  > div {
    display: flex;
    align-items: flex-end;
  }
  h3 {
    color: ${colors.discord.white};
    /* text-transform: uppercase; */
  }
  h4 {
    color: ${colors.discord.text};
  }
`

const Content = styled.div`
  padding: ${props => props.expanded ? '0 calc(19px + 6px) 50px 15px' : '0 0 50px 0'}; /* 6px is the custom scrollbar */
`

const MenuSectionHeader = styled.span`
  font-weight: 600;
  line-height: 16px;
  color: #dcddde;
  text-transform: uppercase;
  font-size: 12px;
  /* margin-left: 20px; */
  margin-bottom: 8px;
`

const UserContainer = styled.div`
  display: flex;
  justify-content: space-between;
  /* flex-direction: column; */
  align-items: center;
  margin: 10px 0;
  > div {
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  span {
    font-size: 20px;
    font-weight: 600;
    color: ${colors.discord.white};
    margin: 20px 0;
    word-break: break-all;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-left: 10px;
    margin-right: 10px;
  }
`

const MyDropdown = styled(Dropdown)`
  display: flex !important;
  margin-bottom: 0;
  margin-top: 7px;
  /* margin-left: 20px; */
  /* margin-right: 20px; */
  background-color: green;
  &:hover {
    cursor: not-allowed;
  }
`

const LogoutModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  button {
    padding: 1em 1.5em;
  }
  button {
    background: transparent;
    
    padding-right: 2em;
    color: white;
    user-select: none;
    border-style: none;
    /* font-family: Whitney; */
    &:hover {
      cursor: pointer;
      color: white;
      text-decoration: underline;
    }
    &:focus {
      outline: none;
    }
  }
`

// class LeftMenu extends Component {
//   constructor () {
//     super()
//     this.state = {
//       expanded: true,
//       page: pages.DASHBOARD,
//       logoutConfirm: false,
//       showFeedBy: 'title'
//       // ,
//       // showArticleByOptions: [],
//       // showArticleBy: ''
//     }
//   }

//   onChangeFeed = (e, data) => {
//     const { setActiveFeed } = this.props
//     if (data.value === this.props.feedId) return
//     setActiveFeed(data.value)
//   }

//   onChangeServer = (e, data) => {
//     const { setActiveGuild, guildId } = this.props
//     if (data.value === guildId) return
//     setActiveGuild(data.value)
//   }

//   menuButtonClick = page => {
//     if (!this.props.disableMenuButtonToggle) this.props.toggleLeftMenu()
//     this.props.changePage(page)
//   }

//   logoutClick = () => {
//     const modalProps = {
//       footer: (<LogoutModalFooter>
//         <button onClick={modal.hide}>Cancel</button>
//         <Button color='red' onClick={e => {
//           window.location.href = '/logout'
//         }}>Log Out</Button>
//       </LogoutModalFooter>),
//     }
//     const children = <h4 style={{padding: '0.5em'}}>Are you sure you want to log out?</h4>
//     modal.show(modalProps, children)
//   }

//   render () {
//     const { feedId, guildId, feeds, feed, guilds, user, channels, articlesFetching, articlesError } = this.props
//     const feedDropdownOptions = []
//     const serverDropdownOptions = []
//     const guildFeeds = feeds[guildId]
//     if (guildFeeds) {
//       for (const rssName in guildFeeds) {
//         const feed = guildFeeds[rssName]
//         const channel = channels[guildId] && channels[guildId][feed.channel] ? ` (#${channels[guildId][feed.channel].name})` : ''
//         feedDropdownOptions.push({ text: `${feed[this.state.showFeedBy]}${channel}`, value: rssName })
//       }
//     }

//     for (const guildId in guilds) {
//       const guild = guilds[guildId]
//       serverDropdownOptions.push({ text: guild.name, value: guildId })
//     }

//     const userAvatar = user ? (user.displayAvatarURL || `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`) : undefined
//     const noServers = serverDropdownOptions.length === 0
//     const noFeeds = feedDropdownOptions.length === 0
    
//     return (
//       <LeftMenuDiv expanded={this.props.expanded}>
//         <Scrollbars>
//           <Content expanded={this.props.expanded}>
//         <div>

//         {this.props.disableMenuButtonToggle 
//           ? <Header to='/'>
//             <div>
//               <img alt='Discord RSS logo' src='https://discordapp.com/assets/d36b33903dafb0107bb067b55bdd9cbc.svg' width='30px' />
//               <h3 style={{margin: '0 10px'}}>Discord.RSS</h3>
//               <h4 style={{margin: 0}}>Control Panel</h4>
//             </div>
//           {
//             this.props.socketStatus === socketStatus.CONNECTED
//               ? <Popup trigger={<Icon name={'check circle outline'} size='large' color='green' />} content='Server is connected, and all changes are bidirectionally live' position='bottom left' inverted/>
//               : this.props.socketStatus === socketStatus.DISCONNECTED ? <Popup trigger={<Icon name={'x'} size='large' color='red' />} content='Server is disconnected. No changes will be saved!' position='bottom left' inverted/>
//                 : <Popup trigger={<Icon name={'question circle outline'} size='large' color='grey' />} content='Attempting to connect to server...' position='bottom left' inverted/>
//           }
//           </Header>
//           : null
//         }
//         {/* <Divider /> */}
//           <UserContainer>
//             <div>
//               <DiscordAvatar src={userAvatar} width='30px' />
//               <span>{user ? user.username : undefined}</span>
//             </div>
//             <Popup
//               trigger={<Button basic icon='log out' color='red' onClick={this.logoutClick} />}
//               inverted
//               position='bottom right'
//               content='Log Out'
//             />
            
//           </UserContainer>
          
//           {/* <Button fluid content='Logout' basic color='red' onClick={this.logoutClick} /> */}
//           <Divider />
//           <MenuSectionHeader>Main</MenuSectionHeader>
//           <MenuButton to={pages.DASHBOARD} selected={this.props.page === pages.DASHBOARD} onClick={() => this.menuButtonClick(pages.DASHBOARD)}>Home</MenuButton>
//           <Divider />
//           <MenuSectionHeader>Server</MenuSectionHeader>
//           <MyDropdown noResultsMessage='No servers found' search={!isMobile} placeholder={noServers ? 'No servers found' : 'Select a server'} options={serverDropdownOptions} disabled={noServers} value={guildId} selection onChange={this.onChangeServer} />
//           <MenuButton to={pages.FEEDS} disabled={!guildId} selected={this.props.page === pages.FEEDS} onClick={() => this.menuButtonClick(pages.FEEDS)}>Feeds</MenuButton>
//           <MenuButton to={pages.SERVER_SETTINGS} disabled={!guildId} selected={this.props.page === pages.SERVER_SETTINGS} onClick={() => this.menuButtonClick(pages.SERVER_SETTINGS)}>Settings</MenuButton>
//           <Divider />
//           <MenuSectionHeader>Feed</MenuSectionHeader>
//           <MyDropdown error={!articlesFetching && !!articlesError} loading={articlesFetching} noResultsMessage='No feeds found' search={!isMobile} placeholder={articlesFetching && feed ? `Fetching articles for ${feed.title}...` : noServers ? 'No server found' : noFeeds ? 'No feeds found' : 'Select a feed'} options={feedDropdownOptions} disabled={noFeeds || articlesFetching} value={articlesFetching ? '' : feedId} selection onChange={this.onChangeFeed} />
//           <MenuButton to={pages.MESSAGE} disabled={!feedId} onClick={() => !feedId ? null : this.menuButtonClick(pages.MESSAGE)} selected={this.props.page === pages.MESSAGE}>Message</MenuButton>            
//           <MenuButton to={pages.FILTERS} disabled={!feedId} onClick={() => !feedId ? null : this.menuButtonClick(pages.FILTERS)} selected={this.props.page === pages.FILTERS}>Filters</MenuButton>
//           <MenuButton to={pages.SUBSCRIPTIONS} disabled={!feedId} onClick={() => !feedId ? null : this.menuButtonClick(pages.SUBSCRIPTIONS)} selected={this.props.page === pages.SUBSCRIPTIONS}>Subscriptions</MenuButton>
//           <MenuButton to={pages.MISC_OPTIONS} disabled={!feedId} onClick={() => !feedId ? null : this.menuButtonClick(pages.MISC_OPTIONS)} selected={this.props.page === pages.MISC_OPTIONS}>Misc Options</MenuButton>
//           <MenuButton to={pages.DEBUGGER} disabled={!feedId} onClick={() => !feedId ? null : this.menuButtonClick(pages.DEBUGGER)} selected={this.props.page === pages.DEBUGGER}>Debugger</MenuButton>

//           <Divider />
          
//           {/* <MenuSectionHeader>Tools</MenuSectionHeader>
//           <MenuButton to={pages.FEED_BROWSER} onClick={() => this.menuButtonClick(pages.FEED_BROWSER)} selected={this.props.page === pages.FEED_BROWSER}>Feed Browser</MenuButton>
//           <Divider /> */}

//           {/* <MenuSectionHeader>Information</MenuSectionHeader> */}

//           {/* <RouterLink to='/faq' onClick={() => this.props.changePage(pages.FAQ)}> */}
//             {/* <MenuButton to='/' unsupported selected={this.props.page === pages.FAQ}>FAQ</MenuButton> */}
//           {/* </RouterLink> */}
//           {/* <RouterLink to='/support' onClick={() => this.props.changePage(pages.SUPPORT)}> */}
//           {/* <MenuButton to='/' unsupported selected={this.props.page === pages.SUPPORT}>Support</MenuButton> */}
//           {/* <MenuButton to={pages.TODO} onClick={() => this.menuButtonClick(pages.TODO)} selected={this.props.page === pages.TODO}>To Do List</MenuButton> */}
//           {/* </RouterLink> */}


//         </div>
//         <div>
//           {/* <Divider />
//           <MenuButton to='/' unsupported>Feedback</MenuButton> */}
//         </div>
//         </Content>
//         </Scrollbars>
//       </LeftMenuDiv>
//     )
//   }
// }

// LeftMenu.propTypes = {
//   page: PropTypes.string,
//   changePage: PropTypes.func,
//   feeds: PropTypes.object,
//   user: PropTypes.object,
//   guildId: PropTypes.string
// }

function LeftMenu (props) {
  const feeds = useSelector(state => state.feeds)
  const guilds = useSelector(state => state.guilds)
  const channels = useSelector(state => state.channels)
  const guildId = useSelector(state => state.activeGuildID)
  const page = useSelector(state => state.page)
  const user = useSelector(state => state.user)
  const feedId = useSelector(getActiveFeedID)
  const feed = useSelector(getActiveFeed)
  const articlesError = useSelector(articlesFetchErroredSelector)
  const articlesFetching = useSelector(articlesFetchingSelector)
  const dispatch = useDispatch()
  const feedDropdownOptions = []
  const serverDropdownOptions = []
  for (const storedFeed of feeds) {
    const channel = channels.find(c => c.id === storedFeed.channel)
    const channelText = channel ? ` (#${channel.name})` : ''
    feedDropdownOptions.push({ text: `${storedFeed.title}${channelText}`, value: storedFeed._id })
  }

  for (const guild of guilds) {
    serverDropdownOptions.push({ text: guild.name, value: guild.id })
  }

  const userAvatar = user ? (user.displayAvatarURL || `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`) : undefined
  const noServers = serverDropdownOptions.length === 0
  const noFeeds = feedDropdownOptions.length === 0
  
  function setGuild (guildID) {
    dispatch(setActiveGuild(guildID))
  }

  function setFeed (feedID) {
    dispatch(setActiveFeed(feedID))
  }

  function menuButtonClick (page) {
    if (!props.disableMenuButtonToggle) {
      props.toggleLeftMenu()
    }
    dispatch(changePage(page))
  }

  function logoutClick () {
    const modalProps = {
      footer: (<LogoutModalFooter>
        <button onClick={modal.hide}>Cancel</button>
        <Button color='red' onClick={e => {
          window.location.href = '/logout'
        }}>Log Out</Button>
      </LogoutModalFooter>),
    }
    const children = <h4 style={{padding: '0.5em'}}>Are you sure you want to log out?</h4>
    modal.show(modalProps, children)
  }

  return (
    <LeftMenuDiv expanded={props.expanded}>
      <Scrollbars>
        <Content expanded={props.expanded}>
      <div>

      {props.disableMenuButtonToggle 
        ? <Header to='/'>
          <div>
            <img alt='Discord RSS logo' src='https://discordapp.com/assets/d36b33903dafb0107bb067b55bdd9cbc.svg' width='30px' />
            <h3 style={{margin: '0 10px'}}>Discord.RSS</h3>
            <h4 style={{margin: 0}}>Control Panel</h4>
          </div>
        </Header>
        : null
      }
      {/* <Divider /> */}
        <UserContainer>
          <div>
            <DiscordAvatar src={userAvatar} width='30px' />
            <span>{user ? user.username : undefined}</span>
          </div>
          <Popup
            trigger={<Button basic icon='log out' color='red' onClick={logoutClick} />}
            inverted
            position='bottom right'
            content='Log Out'
          />
          
        </UserContainer>
        
        {/* <Button fluid content='Logout' basic color='red' onClick={this.logoutClick} /> */}
        <Divider />
        <MenuSectionHeader>Main</MenuSectionHeader>
        <MenuButton to={pages.DASHBOARD} selected={page === pages.DASHBOARD} onClick={() => menuButtonClick(pages.DASHBOARD)}>Home</MenuButton>
        <Divider />
        <MenuSectionHeader>Server</MenuSectionHeader>
        <MyDropdown noResultsMessage='No servers found' search={!isMobile} placeholder={noServers ? 'No servers found' : 'Select a server'} options={serverDropdownOptions} disabled={noServers} value={guildId} selection onChange={(e, data) => setGuild(data.value)} />
        <MenuButton to={pages.FEEDS} disabled={!guildId} selected={page === pages.FEEDS} onClick={() => menuButtonClick(pages.FEEDS)}>Feeds</MenuButton>
        <MenuButton to={pages.SERVER_SETTINGS} disabled={!guildId} selected={page === pages.SERVER_SETTINGS} onClick={() => menuButtonClick(pages.SERVER_SETTINGS)}>Settings</MenuButton>
        <Divider />
        <MenuSectionHeader>Feed</MenuSectionHeader>
        <MyDropdown error={!articlesFetching && !!articlesError} loading={articlesFetching} noResultsMessage='No feeds found' search={!isMobile} placeholder={articlesFetching && feed ? `Fetching articles for ${feed.title}...` : noServers ? 'No server found' : noFeeds ? 'No feeds found' : 'Select a feed'} options={feedDropdownOptions} disabled={noFeeds || articlesFetching} value={articlesFetching ? '' : feedId} selection onChange={(e, data) => setFeed(data.value)} />
        <MenuButton to={pages.MESSAGE} disabled={!feedId} onClick={() => menuButtonClick(pages.MESSAGE)} selected={page === pages.MESSAGE}>Message</MenuButton>            
        <MenuButton to={pages.FILTERS} disabled={!feedId} onClick={() => menuButtonClick(pages.FILTERS)} selected={page === pages.FILTERS}>Filters</MenuButton>
        <MenuButton to={pages.SUBSCRIPTIONS} disabled={!feedId} onClick={() => menuButtonClick(pages.SUBSCRIPTIONS)} selected={page === pages.SUBSCRIPTIONS}>Subscriptions</MenuButton>
        <MenuButton to={pages.MISC_OPTIONS} disabled={!feedId} onClick={() => menuButtonClick(pages.MISC_OPTIONS)} selected={page === pages.MISC_OPTIONS}>Misc Options</MenuButton>
        <MenuButton to={pages.DEBUGGER} disabled={!feedId} onClick={() => menuButtonClick(pages.DEBUGGER)} selected={page === pages.DEBUGGER}>Debugger</MenuButton>

        <Divider />
        
        {/* <MenuSectionHeader>Tools</MenuSectionHeader>
        <MenuButton to={pages.FEED_BROWSER} onClick={() => this.menuButtonClick(pages.FEED_BROWSER)} selected={this.props.page === pages.FEED_BROWSER}>Feed Browser</MenuButton>
        <Divider /> */}

        {/* <MenuSectionHeader>Information</MenuSectionHeader> */}

        {/* <RouterLink to='/faq' onClick={() => this.props.changePage(pages.FAQ)}> */}
          {/* <MenuButton to='/' unsupported selected={this.props.page === pages.FAQ}>FAQ</MenuButton> */}
        {/* </RouterLink> */}
        {/* <RouterLink to='/support' onClick={() => this.props.changePage(pages.SUPPORT)}> */}
        {/* <MenuButton to='/' unsupported selected={this.props.page === pages.SUPPORT}>Support</MenuButton> */}
        {/* <MenuButton to={pages.TODO} onClick={() => this.menuButtonClick(pages.TODO)} selected={this.props.page === pages.TODO}>To Do List</MenuButton> */}
        {/* </RouterLink> */}


      </div>
      <div>
        {/* <Divider />
        <MenuButton to='/' unsupported>Feedback</MenuButton> */}
      </div>
      </Content>
      </Scrollbars>
    </LeftMenuDiv>
  )
}

export default LeftMenu

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LeftMenu))
