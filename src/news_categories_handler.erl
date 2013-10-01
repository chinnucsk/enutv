-module(news_categories_handler).
-author("shree@ybrantdigital.com").

-export([init/3]).

-export([content_types_provided/2]).
-export([welcome/2]).
-export([terminate/3]).

%% Init
init(_Transport, _Req, []) ->
	{upgrade, protocol, cowboy_rest}.

%% Callbacks
content_types_provided(Req, State) ->
	{[		
		{<<"text/html">>, welcome}	
	], Req, State}.

terminate(_Reason, _Req, _State) ->
	ok.

%% API
welcome(Req, State) ->
	{[{Name,Value}], Req2} = cowboy_req:bindings(Req),
	{Page, PageNumber} = cowboy_req:qs_val(<<"page">>, Req),
	Url = case binary_to_list(Value) of 
		"World" ->
			%Category = "US",
			enutv_util:news_category_url("world_news", list_to_integer(binary_to_list(Page)) );
		"US" ->
			%Category = "US",
			enutv_util:news_category_url("us_news", list_to_integer(binary_to_list(Page)));
			
		"Politics" ->
			%Category = "Politics",
			enutv_util:news_category_url("us_politics", list_to_integer(binary_to_list(Page)));
			
		"Entertainment" ->
			%Category = "Entertainment",
			enutv_util:news_category_url("us_entertainment", list_to_integer(binary_to_list(Page)));
		
		"Markets" ->
			%Category = "Entertainment",
			enutv_util:news_category_url("us_markets", list_to_integer(binary_to_list(Page)));			

		"Money" ->
			%Category = "Entertainment",
			enutv_util:news_category_url("us_money", list_to_integer(binary_to_list(Page)));			
		_ ->

			%Category = "None",
			lager:info("#########################None")

	end,
	%Url = wildridge_util:news_db_url(binary_to_list(Value)), 
	{ok, "200", _, Response} = ibrowse:send_req(Url,[],get,[],[]),
	Res = string:sub_string(Response, 1, string:len(Response) -1 ),
	Params = jsx:decode(list_to_binary(Res)),
	{value, {<<"rows">>, RowsList }}= lists:keysearch(<<"rows">>,1, Params),
	%Titles = [ Title || [_,_,{<<"value">>,[{<<"title">>,Title},_]}] <- RowsList ],
	Id_Title_Descriptions =  [ [{ <<"id">>, Id} , {<<"title">>, Title}, {<<"description">>,Description}] || [{_,Id},_,{<<"value">>,[{<<"title">>,Title},{_,Description}]}] <- RowsList ],
	{ok, Body} = news_categories_page_dtl:render([{<<"titles">>, Id_Title_Descriptions}, {<<"category">>, binary_to_list(Value) }]),
    {Body, Req2, State}.
    


